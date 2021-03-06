import * as d3 from "d3";

export function selectSelectedNodes() {
  return d3.selectAll('.node.selected');
}

export function selectSelectedLinks() {
  return d3.selectAll('.link.selected');
}
