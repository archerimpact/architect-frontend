import * as d3 from "d3";
import * as selection from "./selection.js";
import * as utils from "./utils.js";
import * as constants from "./constants.js";
import * as colors from "./colorConstants.js";

// ==============
// CLASSING NODES
// ==============

export function classExpandableNodes() {
    this.node.classed('expandable', false);
    this.node.filter((d) => { return utils.isExpandable(d); })
        .classed('expandable', true);
}

export function classNodesSelected(nodes, isSelected) {
    nodes.classed('selected', (d) => { return d.selected = isSelected; });
    applyLinkHighlighting.bind(this)();
}

export function classAllNodesFixed() {
    let fixGraph = this.container.selectAll('.node:not(.fixed)')[0].length > 0;
    this.node
        .each(function (d) {
            const currNode = d3.select(this);
            currNode.classed('fixed', d.fixed = fixGraph);
        });
}

// =================
// LINK HIGHLIGHTING
// =================

// Manually highlight given links
// Should be used to reset some/all link highlights (thus the refresh flag)
// Optionally refreshes userSelectedLinks dictionary (eg when user clicks an object/canvas)
export function highlightLinks(links, isSelected, refresh=false) {
    links.call(this.styleLink, (l) => { return l.selected = isSelected; });
    if (refresh) {
        this.userSelectedLinks = {};
        return;
    }

    if (!isSelected) {
        links.each((l) => { 
            if (l.id in this.userSelectedLinks) { 
                this.userSelectedLinks[l.id] = false; 
            }
        });
    }
}

// Manually highlight given link, identified by source and target nodes
export function highlightLink(source, target, isSelected=true) {
    const linkId = this.linkedById[source.id + ',' + target.id] || this.linkedById[target.id + ',' + source.id];
    highlightLinkById.bind(this)(linkId, isSelected);
}

// Manually highlight given link, identified by linkId
export function highlightLinkById(linkId, isSelected=true) {
    if (isSelected || linkId in this.userSelectedLinks) { this.userSelectedLinks[linkId] = isSelected; }
    this.link.filter((l) => { return l.id === linkId; })
        .call(this.styleLink, (l) => { return l.selected = isSelected; });
}

// Automatic link selection between all selected nodes
export function highlightLinksFromAllNodes() {
    this.link
        .filter((l) => { 
            return ((l.source.possible || l.source.selected) 
                && (l.target.possible || l.target.selected)) 
                || l.selected; 
        })
        .call(this.styleLink, true);
}

// Automatic link selection between all possible nodes
// Used for rectangular and free select tools
export function highlightPossibleLinksFromAllNodes() {
    this.link
        .classed('possible', (l) => { 
            return (l.source.possible || l.source.selected) 
                && (l.target.possible || l.target.selected); 
        })
        .call(styleLinkMarkers, (l) => { 
            return ((l.source.possible || l.source.selected) 
                && (l.target.possible || l.target.selected)) 
                || l.selected; 
        });
}

// Automatic link selection of links from given node
// Use for granular updates to user selection
export function highlightLinksFromNode(node) {
    node = node[0][0].__data__.index;
    this.link.filter((l) => { return l.source.index === node || l.target.index === node; })
        .call(this.styleLink, (l) => { 
            return ((l.source.possible || l.source.selected) 
                && (l.target.possible || l.target.selected)) 
                || l.selected;
         });
}

// Apply both user-selected and automatic highlighting
export function applyLinkHighlighting() {
    this.link.call(this.styleLink, false);
    highlightLinksFromAllNodes.bind(this)();
    for (let linkId in this.userSelectedLinks) {
        highlightLinkById.bind(this)(linkId, this.userSelectedLinks[linkId]);
    }
}

// Clear all node/link highlights
export function clearObjectHighlighting() {
    this.node.classed('selected', (d) => { return d.selected = false; });
    this.link.call(this.styleLink, false);
}

// Clear all highlights and reset saved user selections
export function resetObjectHighlighting() {
    classNodesSelected.bind(this)(this.node, false);
    highlightLinks.bind(this)(this.link, false, true);
}

// ==============
// OBJECT STYLING
// ==============

export function styleNode(selected) {
    selected.select('circle')
        .attr('r', (d) => { return d.radius = (d.group ? constants.GROUP_NODE_RADIUS : constants.NODE_RADIUS); })
        .classed('hull-node', (d) => { return d.group; })
        .style('stroke', (d) => { return d.group ? colors.HEX_WHITE : getNodeColor(d); })
        .style('fill', (d) => { return getNodeColor(d); });
        // .style('fill', (d) => { return d.group ? getNodeColor(d) : colors.HEX_LIGHT_GRAY; });

    selected.select('.node-glyph')
        .style('stroke', (d) => { return getNodeColor(d); });
        // .style('fill', (d) => { return getNodeColor(d); });

    selected.select('.glyph-label')
        .style('fill', (d) => { return getNodeColor(d); })
        .style('stroke', (d) => { return getNodeColor(d); });

    selected.select('.icon')
        .style('stroke', (d) => { return getNodeColor(d); });
        // .style('fill', (d) => { return getNodeColor(d); });
}

export function getNodeColor(d) {
    return colors.NODE_COLORS[d.type] || colors.HEX_DARK_GRAY;
}

export function styleLink(selected, isSelected) {
    selected
        .classed('selected', isSelected)
        .style('stroke-width', (l) => { return (l.source.group && l.target.group ? constants.GROUP_STROKE_WIDTH : constants.STROKE_WIDTH) + 'px'; });
    styleLinkMarkers(selected, isSelected);
}

export function styleLinkMarkers(selected, isSelected) {
    selected
        .style('marker-start', (l) => {
            if (!l.bidirectional) { return ''; }
            const size = l.target.group ? 'small' : 'big';
            const color = (typeof isSelected === 'function' ? isSelected(l) : isSelected) ? 'blue' : 'gray';
            return `url(#start-${size}-${color})`;
        })
        .style('marker-end', (l) => {
            const size = l.source.group ? 'small' : 'big';
            const color = (typeof isSelected === 'function' ? isSelected(l) : isSelected) ? 'blue' : 'gray';
            return `url(#end-${size}-${color})`;
        });
}

// ===========
// GROUP NODES
// ===========

// Style fill of group nodes
export function fillGroupNodes() {
    this.svg.selectAll('.node')
        .classed('grouped', function (d) { return utils.isGroup(d) || d.type === 'same_as_group'; });
}

// ============
// GRAPH FADING
// ============

// Graph fading on node hover
export function fadeGraph(d) {
    this.isEmphasized = true;
    this.node
        .filter((o) => { return !this.areNeighbors(d, o); })
        .classed('faded', true);
    this.link.classed('faded', o => { return !(o.source === d || o.target === d); });
    this.hull.classed('faded', true);
}

export function resetGraphOpacity() {
    this.isEmphasized = false;
    this.node.classed('faded', false);
    this.link.classed('faded', false);
    this.hull.classed('faded', false);
}

// =========
// EDIT MODE
// =========

// Reset edit mode's dynamic drag link
export function updateDragLink() {
    if (this.editMode && this.mousedownNode) {
        const x1 = this.mousedownNode.x,
            y1 = this.mousedownNode.y,
            x2 = parseInt(this.dragLink.attr('tx2'), 10),
            y2 = parseInt(this.dragLink.attr('ty2'), 10),
            dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

        if (dist > 0) {
            const baseOffset = 2;
            const targetX = x2 - (x2 - x1) * (dist - this.mousedownNode.radius) / dist,
                targetY = y2 - (y2 - y1) * (dist - this.mousedownNode.radius) / dist;

            this.dragLink
                .attr('x1', targetX)
                .attr('y1', targetY)
                .attr('x2', x2)
                .attr('y2', y2);
        }
    }
}

export function resetDragLink() {
    this.mousedownNode = null;
    this.dragLink
        .style('visibility', 'hidden');
}

// Directions: forward, reverse, both
export function changeLinkDirectionality(selected, newDirection) {
    selected.each((d) => {
        if (d.bidirectional) {
            // Implement after matrix adjacency done
        }
    });
}

// =========
// NODE TEXT
// =========

// Normalize node text to same casing conventions and length
// printFull states => 0: abbrev, 1: none, 2: full
export function processNodeName(str, printFull) {
    if (!str) { return 'Document'; }
    if (printFull === 1) { return ''; }
    // const delims = [' ', '.', '('];
    // for (let i = 0; i < delims.length; i++) {
    //     str = splitAndCapitalize(str, delims[i]);
    // }

    return str;
}

export function toggleNodeNameLength() {
    this.printFull = (this.printFull + 1) % 3;
    this.selectAllNodeNames()
        .text((d) => { return processNodeName(d.name ? d.name : (d.number ? d.number : d.address), this.printFull); })
        .call(this.wrapNodeText, this.printFull);
}

export function splitAndCapitalize(str, splitChar) {
    let tokens = str.toString().split(splitChar);
    tokens = tokens.map(function (token, idx) {
        return capitalize(token, splitChar === ' ');
    });

    return tokens.join(splitChar);
}

export function capitalize(str, first) {
    return str.charAt(0).toUpperCase() + (first ? str.slice(1).toLowerCase() : str.slice(1));
}

// Wrap text
export function wrapNodeText(textSelection, printFull, width=100) {
    textSelection.each(function (d) {
        const text = d3.select(this);
        const tokens = text.text().split(' ');
        text.text(null);

        let line = [];
        let remainder;
        let lineNum = 0;
        const dy = parseInt(text.attr('dy'), 10);
        let tspan = text.append('tspan')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('dy', dy)
                        .classed('unselectable', true);

        let i;
        for (i = 0; i < tokens.length; i++) {
            line.push(tokens[i]);
            tspan = tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
                remainder = (line.length > 1) ? line.pop() : null;
                tspan.text(line.join(' '));
                tspan = text.append('tspan')
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('dy', 15 * (++lineNum) + dy)
                            .classed('unselectable', true);

                line = remainder ? [remainder] : [];
            }

            if (printFull === 0 && lineNum > 0) {
                break;
            }
        }

        let finalLine = line.join(' ');
        finalLine = (printFull === 0 && i < tokens.length-1) ? `${finalLine.trim()}...` : finalLine;
        tspan.text(finalLine);
    });
}

// =========
// LINK TEXT
// =========

// Assumes link relationships are all uppercase, separated by undescores
export function processLinkText(str) {
    return str.toLowerCase().split('_').join(' ');
}

export function updateLinkText(selection) {
    const linkEnter = this.linkContainer.selectAll('.link-text')
        .data(selection, (l) => { return l.id; });

    this.linkText = linkEnter.enter()
        .append('text')
        .attr('class', 'link-text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.3em');

    this.linkText
            .attr('transform', rotateLinkText)
        .append('textPath')
            .attr('id', (l) => { return `text-${utils.hash(l.id)}`; })
            .attr('startOffset', '50%')
            .attr('xlink:href', (l) => { return `#link-${utils.hash(l.id)}`; })
            .attr('length', (l) => { return l.distance; })
            .text((l) => { return processLinkText(l.type); })
            .each(hideLongLinkText);

    linkEnter.exit().remove();
    this.link.attr('stroke-dasharray', createLinkTextBackground);
    this.force.resume();
}

export function createLinkTextBackground(link) {
    const textPath = d3.select(`#text-${utils.hash(link.id)}`);
    if (textPath[0][0] === null || textPath.text() === "") return 'none';
    const spaceLength = textPath.node().getComputedTextLength() + textPath.node().getNumberOfChars() * 2 - 10;
    const lineLength = Math.sqrt(Math.pow(link.sourceX-link.targetX, 2) + Math.pow(link.sourceY-link.targetY, 2)) - spaceLength;
    return `${lineLength/2-7.5} ${spaceLength+15}`;
}

export function rotateLinkText(link) {
    if (link.sourceX < link.targetX) return '';
    const centerX = link.sourceX + (link.targetX - link.sourceX)/2;
    const centerY = link.sourceY + (link.targetY - link.sourceY)/2;
    return `rotate(180 ${centerX} ${centerY})`;
}

export function hideLongLinkText(link) {
    const textPath = d3.select(this); 
    const textLength = textPath.node().getComputedTextLength() + textPath.node().getNumberOfChars() * 2 - 10;
    const pathLength = Math.sqrt(Math.pow(link.sourceX-link.targetX, 2) + Math.pow(link.sourceY-link.targetY, 2));
    textPath.classed('hidden', textLength > pathLength - 16);
}
