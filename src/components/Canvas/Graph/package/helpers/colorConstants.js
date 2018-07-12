import * as constants from "./constants.js";

export const HEX_BLUE = '#0d77e2';
export const HEX_WHITE = '#ffffff';
export const HEX_LIGHT_GRAY = '#ebebeb';
export const HEX_GRAY = '#999';
export const HEX_DARK_GRAY = '#545454';
export const HEX_BLACK = '#000000';
export const HEX_PRIMARY_ACCENT = '#6b238e';
export const HEX_TOOLBAR_BACKGROUND = '#fafafa';
export const HEX_TOOLBAR_BORDER = '#d3d3d3';

export const NODE_COLORS = {
  'person': '#68cca8',
  'Document': '#ea88cc',
  [constants.IDENTIFYING_DOCUMENT]: '#ea88cc',
  'corporation': '#e18c4d',
  [constants.ORGANIZATION]: '#e18c4d',
  'group': '#34675c',
  'same_as_group': '#34675c',
  'Vessel': '#68cca8',
  "Aircraft": '#68cca8',
}

export const NODE_COLORS_COLORBLIND = {
    'person': '#800080',
    'Document': '#008000',
    [constants.IDENTIFYING_DOCUMENT]: '#008000',
    'corporation': '#800000',
    [constants.ORGANIZATION]: '#800000',
    'group': '#008080',
    'same_as_group': '#008080'
}
