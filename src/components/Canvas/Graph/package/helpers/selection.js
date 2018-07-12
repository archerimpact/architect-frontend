import * as d3 from "d3";

export function selectSelectedNodes() {
  return d3.selectAll('.node.selected');
}

export function selectSelectedLinks() {
  return d3.selectAll('.links.selected');
}

export function selectLink(source, target) {
  const linkId = this.linkedById[source.id + ',' + target.id] || this.linkedById[target.id + ',' + source.id];
  this.link.filter((d) => { return d.id === linkId; })
    .call(this.styleLink, true);
}
