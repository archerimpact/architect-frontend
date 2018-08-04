import * as d3 from "d3";
import * as aesthetics from "./aesthetics.js";

export function selectSelectedNodes() {
  return d3.selectAll('.node.selected');
}

export function selectSelectedLinks() {
  return d3.selectAll('.links.selected');
}
