# Architect graph representation
## Summary
Making Architect look snazzy~

## Dev instructions
### Getting started
1. Clone repo, navigate to root folder
2. Install relevant node modules ('npm install')
3. Run 'node server.js' and navigate to localhost:4567 in browser

## Usage
Click and drag on nodes to move and pin them. Click again to unpin. Ctrl-click or drag to select multiple nodes, and ctrl-click again to deselect. Press 'u' to unpin selected nodes.

## Next steps
1. ~~Drag to select multiple nodes at once~~
2. Group selected nodes
3. Move selected nodes together
4. Zoom

## Design decisions
### dragfix, dragselect
The following table details what should happen to each node (which is originally selected or unselected) upon various mouse interactions. The second entry in each cell denotes whether or not the node should be fixed in place after the interaction; toggle indicates !d.fixed.

|            | drag              | ctrl-drag       | click              | ctrl-click       |
|------------|-------------------|-----------------|--------------------|------------------|
| selected   | unselected, fixed | selected, fixed | selected, toggle   | unselected, same |
| unselected | unselected, fixed | selected, fixed | unselected, toggle | selected, same   |

The problem is that the click and drag events fire for all mousedown events, so the click function would execute on mousedrag and vice versa, causing undesirable modifications. Using d3.event.defaultPrevented, we can mitigate this problem somewhat, because we can suppress the click function on a drag event. However, we still must grapple with the drag event firing on click. Therefore, we arrive at the following flow:

click: drag(), click()  
drag: drag()

Obviously, the drag outcomes can be dealt within the respective drag method easily. However, in regards to the click outcomes, the execution flow for a click is as follows: dragstart, drag, dragend, click. Due to this, the drag function will always precede the click function. Referring to the table, it is clear that after an interaction whether or not the node was originally selected or fixed is unclear, because the end states are independent of input. As such, determining the input state of the node in the click function is impossible.

To solve this problem, I introduced two custom attributes to the circle element of each node: dragfix and dragselect, which are set during the drag function to record the node's initial state, and are subsequently accessed and utilized in the onclick handler.
