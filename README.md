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

## Design decisions and implementation details
### Node dragging
The following table details what should happen to each node (which is originally selected or unselected) upon various mouse interactions. The second entry in each cell denotes whether or not the node should be fixed in place after the interaction; toggle indicates !d.fixed.

|            | drag              | ctrl-drag       | click              | ctrl-click       |
|------------|-------------------|-----------------|--------------------|------------------|
| selected   | unselected, fixed | selected, fixed | selected, toggle   | unselected, same |
| unselected | unselected, fixed | selected, fixed | unselected, toggle | selected, same   |

The problem is that the click and drag events fire for all mousedown events, so the click function would execute on mousedrag and vice versa, causing undesirable modifications. Using d3.event.defaultPrevented, we can mitigate this problem somewhat, because we can suppress the click function on a drag event. However, we still must grapple with the drag event firing on click. Therefore, we arrive at the following flow:

click: drag(), click()  
drag: drag()

Obviously, the drag outcomes can be dealt within the respective drag method easily. However, in regards to the click outcomes, the execution flow for a click is as follows: dragstart, drag, dragend, click. Due to this, the drag function will always precede the click function. Referring to the table, it is clear that after a drag interaction, whether or not the node was originally selected or fixed is unclear, because the end states are always the same regardless. As such, determining the input state of the node in the click function is impossible.

To solve this problem, I introduced two custom attributes to the circle element of each node: dragfix and dragselect, which are set during the drag function to record the node's initial state, and are subsequently accessed and utilized in the onclick handler.

### Link highlighting
We want to highlight a link when the nodes on either end of the link are selected. There are various possible implementations, I've decided to use the following scheme: store a mapping between each node's index and its selection state, represented with a boolean. Rather than storing information on node initialization, the first upload of a node's selection state is deferred to the first time the node is selected, as this is the first point any link stemming from this node can be highlighted. There are three methods in which a node can be selected:

1. ctrl-click a node
2. ctrl-drag a node
3. click-drag the canvas over a node

The first two methods can be dealt with in the same way. In order to optimize runtime, we can leverage the fact that these events focus on a single node. We can filter all links on the condition they must stem from this node, reducing the search space. From here, we determine whether or not the node on the opposite end of the link is also selected. 

The third method introduces the possibility of dealing with a large nuber of selected nodes simultaneously. In this case, using the same approach as the first two methods can rapidly become inefficient (i.e. selecting all nodes would cause us to double-count each link). In addition, we cannot calculate link selection the same way we calculate node selection on drag, because it is possible to drag the extent such that it encompasses a link but not the nodes at its ends. Instead, we cycle through all links in the graph and compute on each one. It should be noted that there is a tradeoff here for smaller selections.

The reason we must use the dictionary is that the link datum gives the origin/terminal node indices, but does not include references to the nodes themselves, so we cannot check the class of each node to determine whether or not it is selected. To address this obstacle, we must either store a mapping between node index and node reference or node index and selection state, where we utilize the latter approach.



