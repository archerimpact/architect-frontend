import * as d3 from "d3";
import * as selection from "./selection.js";
import * as utils from "./utils.js";
import * as constants from "./constants.js";
import * as colors from "./colorConstants.js";

// Classing nodes
export function classExpandableNodes() {
    this.node.classed('expandable', false);
    this.node.filter(d => utils.isExpandable(d))
        .classed('expandable', true);
}

export function classAllNodesSelected() {
    this.node.classed('selected', (d) => { return this.nodeSelection[d.index] = true; });
    highlightLinksFromAllNodes.bind(this)();
}

export function classNodeSelected(node, isSelected) {
    node.classed('selected', (d) => { return this.nodeSelection[d.index] = isSelected; });
    highlightLinksFromNode.bind(this, node)();
}

export function classNodesSelected(nodes, isSelected) {
    nodes.classed('selected', (d) => { return this.nodeSelection[d.index] = isSelected; });
    highlightLinksFromAllNodes.bind(this)();
}

export function unclassAllNodesSelected() {
    this.node.classed('selected', (d) => { return this.nodeSelection[d.index] = false; });
    this.link.call(styleLink.bind(this), false);
}

export function classAllNodesFixed() {
    const self = this;
    this.isGraphFixed = !this.isGraphFixed;
    d3.selectAll('.node')
        .each(function (d) {
            const currNode = d3.select(this);
            currNode.classed('fixed', d.fixed = self.isGraphFixed)
        });
}

export function toggleSelectedNodesFixed() {
    const selected = selection.selectSelectedNodes();
    if (selected.empty()) return;
    const currFix = selected.classed('fixed');
    selected.classed('fixed', function (d) { return d.fixed = !currFix; });
    this.force.start();
}

// Link highlighting
export function highlightLinksFromAllNodes() {
    this.link.call(this.styleLink, false);
    this.link.filter((l) => { return this.nodeSelection[l.source.index] && this.nodeSelection[l.target.index] })
        .call(this.styleLink, true);
}

export function highlightLinksFromNode(node) { 
    node = node[0][0].__data__.index;
    this.link.filter((l) => { return l.source.index === node || l.target.index === node; })
        .call(this.styleLink, (l) => { return this.nodeSelection[l.source.index] && this.nodeSelection[l.target.index]; });
}


// Styling graph items
export function styleNode(selected, colorBlind=false) {
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
    selected.classed('selected', isSelected);
    selected
        .style('stroke-width', (l) => { return (l.source.group && l.target.group ? constants.GROUP_STROKE_WIDTH : constants.STROKE_WIDTH) + 'px'; })
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

// Directions: forward, reverse, both
export function changeLinkDirectionality(selected, newDirection) {
    selected.each((d) => {
        if (d.bidirectional) {
            // Implement after matrix adjacency done
        }
    });
}

// Style fill of group nodes
export function fillGroupNodes() {
    this.svg.selectAll('.node')
        .classed('grouped', function (d) { return utils.isGroup(d) || d.type === 'same_as_group'; });
}


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

/* Node & link text */

// Normalize node text to same casing conventions and length
// printFull states - 0: abbrev, 1: none, 2: full
export function processNodeName(str, printFull) {
    if (!str) { return 'Document'; }
    if (printFull === 1) { return ''; }
    const delims = [' ', '.', '('];
    for (let i = 0; i < delims.length; i++) {
        str = splitAndCapitalize(str, delims[i]);
    }

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
