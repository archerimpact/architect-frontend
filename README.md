# Architect graph representation
## Summary
Making Architect look snazzy~

## Dev instructions
### Getting started
1. Clone repo, navigate to root folder
2. Install relevant node modules ('npm install')
3. Run 'node server.js' and navigate to localhost:4567 in browser
4. After making changes to code, run 'npm run watch' to regenerate correct bundle.js with webpack

## Architecture details (hehehe)
### Node dragging and selection
#### 1.0
The following table details what should happen to each node (which is originally selected or unselected) upon various mouse interactions. The second entry in each cell denotes whether or not the node should be fixed in place after the interaction; toggle indicates !d.fixed.

|            | drag              | ctrl-drag       | click              | ctrl-click       |
|------------|-------------------|-----------------|--------------------|------------------|
| selected   | unselected, fixed | selected, fixed | selected, toggle   | unselected, same |
| unselected | unselected, fixed | selected, fixed | unselected, toggle | selected, same   |

The problem is that the click and drag events fire for all mousedown events, so the click function would execute on mousedrag and vice versa, causing undesirable modifications. Using d3.event.defaultPrevented, we can mitigate this problem somewhat, because we can suppress the click function on a drag event. However, we still must grapple with the drag event firing on click. Therefore, we arrive at the following flow:

click: drag() --> click()  
drag: drag()

Obviously, the drag outcomes can be dealt within the respective drag method easily. However, in regards to the click outcomes, the execution flow for a click is as follows: dragstart, drag, dragend, click. Due to this, the drag function will always precede the click function. Referring to the table, it is clear that after a drag interaction, whether or not the node was originally selected or fixed is unclear, because the end states are always the same regardless. As such, determining the input state of the node in the click function is impossible.

To solve this problem, I introduced two custom attributes to the circle element of each node: dragfix and dragselect, which are set during the drag function to record the node's initial state, and are subsequently accessed and utilized in the onclick handler.

#### 1.1
This section has changed significantly with the reorganization of selection to right-click and node/canvas movement to left-click. Because we are halving the number of actions bound to left-click, usage of the ctrl has been minimized. The tricky part now is the difference in flows between left and right clicks:

|            | l-click     | l-drag     | r-click          | r-drag          |
|------------|-------------|------------|------------------|-----------------|
| selected   | n/a, toggle | n/a, fixed | unselected, same | selected, fixed |
| unselected | n/a, toggle | n/a, fixed | selected, same   | selected, fixed |

l-click: drag() --> click()  
l-drag: drag()  
r-click: drag() --> context()  
r-drag: drag() --> context()

Where certain entries are n/a in the table b/c the left mouse button never interacts with selection and context() represents the context menu opening event which we can hijack for our own right-click purposes. Looking at l-click, we can see that drag() always fires first, and performs the same action regardless of initial state. Again, by utilizing d3.event.defaultPrevented, which prevents click() from firing after an actual drag motion, and the dragfix attribute from subsection 1.0, we can handle l-click and l-drag easily.

However, the right-click flow doesn't share the same flow where click() is only called on a click action. Instead, context() is always called on right mousedown. Instead, we will use context() solely to suppress the default menu behavior and create a right-click handler that is called directly from drag(). In order to do this, we introduce a new attribute, dragdistance, which is set to 0 in dragstart(), and incremented in dragging(). In dragend(), if dragdistance == 0, we know the action was indeed a click and not a drag, so we trigger rightclick() and pass in the current node reference as well as its datum. At this point the flow for right click looks like:

r-click: drag() --> rightclick() --> context()  
r-drag: drag() --> context()

Which falls in line with the left click flow. It should be noted that while left-clicking never modified selection state, right click does modify fixed state (right-drag fixes the node), so rightclick() requires both dragselect and dragfix to recover the original state from r-drag.

### Link highlighting
We want to highlight a link when the nodes on either end of the link are selected. There are various possible implementations, I've decided to use the following scheme: store a mapping between each node's index and its selection state, represented with a boolean. Rather than storing information on node initialization, the first upload of a node's selection state is deferred to the first time the node is selected, as this is the first point any link stemming from this node can be highlighted. There are three methods in which a node can be selected:

1. r-click a node
2. r-click+drag a node
3. r-click+drag the canvas over a node

The first two methods can be dealt with in the same way. In order to optimize runtime, we can leverage the fact that these events focus on a single node. We can filter all links on the condition they must stem from this node, reducing the search space. From here, we determine whether or not the node on the opposite end of the link is also selected. 

The third method introduces the possibility of dealing with a large nuber of selected nodes simultaneously. In this case, using the same approach as the first two methods can rapidly become inefficient (i.e. selecting all nodes would cause us to double-count each link). In addition, we cannot calculate link selection the same way we calculate node selection on drag, because it is possible to drag the extent such that it encompasses a link but not the nodes at its ends. Instead, we cycle through all links in the graph and compute on each one. It should be noted that there is a tradeoff here for smaller selections.

The reason we must use the dictionary is that the link datum gives the origin/terminal node indices, but does not include references to the nodes themselves, so we cannot check the class of each node to determine whether or not it is selected. To address this obstacle, we must either store a mapping between node index and node reference or node index and selection state, where we utilize the latter approach.

### Adjacency Matrix for nodes and links
The adjacency matrix is the best way to store a series of links and nodes in a graph.

The matrix is first constructed in setMatrix(), and looks like the following:

|    |  0  |  1  |  2  |  3  |
|----|-----|-----|-----|-----|
| 0  | {}  | {}  | {}  | {}  |
|----|-----|-----|-----|-----|
| 1  | {}  | {}  | {}  | {}  |

The objects in each box contain the following:
  {
    state: ,
    data: 
  }

Where state can be NONEXISTENT, DISPLAYED, HIDDEN, GROUP_MEMBER, or BELONGS_TO.
Data contains the datum object of the node or link in question, if it exists.

The entries along the diagonal (i.e. (0, 0) or (1, 1) or (2, 2)) contain the state and data for the node of index 0, 1, 2, etc. Nodes only contain the states NONEXISTENT, DISPLAYED, or HIDDEN in practice.

The entry at (1, 2) contains the link going from source: node at index 1 to target: node at index 2.

Description of the different states:
NONEXISTENT -- the link doesn't exist. Data is also null.
DISPLAYED -- the link or node is displayed.
HIDDEN -- the link or node exists, but is not displayed; data contains the data of the hidden item.
GROUP_MEMBER -- for (i, j) === GROUP_MEMBER, j is a group member of i.
BELONGS_TO -- for (i, j) === BELONGS_TO, i is a group member of j.
 
I decided to include hidden nodes in the matrix so that it's easy to add the node or linke back when you unhide it, and so that operations which delete or hide links will still reflect when you unhide a node (i.e. there won't be a hanging link). When you create a group, you essentially hide the nodes that have been grouped; when you expand a group, you essentially hide the group's node and display the nodes in the group. Thus the nodes only need three states: NONEXISTENT, DISPLAYED, and HIDDEN.

The benefits of a matrix includes:
1. When you delete a node, you can delete the entire column and row so that none of the past links are available.
2. You can access a node and any links associated with that node with constant time for each access.

Now, changeD3Data contains the functions for converting d or select data into the indexes that the matrix understands. Matrix.js contains all the logic for manipulating matrix items and does not rely on any other file; the matrix should probably be its own class in the future.

### Updating data
We want to have a generic update function that can handle any case of nodes and links being deleted, added, modified, grouped, and so on. Thus I've implemented one update() function that calls .data() on the global nodes and links variables. Whenever a function wants to alter the nodes and links on the SVG, it should follow this flow:

1. Edit the adjacency matrix display setting for the node or link of your choice
2. Update() calls matrixToGraph() which constructs the links and nodes from the items that are displayed
2. Each entry in links and nodes should have an id field that contains a unique id 
3. Call update()

This makes for a relatively abstract updating process. As long as you're confident that the global links and nodes variables contain the right set of data, calling update() will display the visualization correctly.

Update works as follows for nodes:

1. Call .data() on the new data  
  ** note: the keys in .data(values, keys) are important -- I remapped all of the keys to the id of the datum to ensure that the references in the data would be updated according to the new order of the data
2. Create a nodeEnter = node.enter().append('g')  
  ** note: .enter() creates a placeholder attached to the datum, .append('g') connects the new 'g' element to the placeholder
3. Call .exit().remove() to remove fields that are no longer attached to a piece of data
4. Append circle and text to the enter in order for it to be called only on newly updated or moved nodes, instead of all nodes


### Removing Nodes
To remove a node, simply delete that node's row/column in the adjacency matrix. This will delete all links as well.

### Grouping Nodes
We want to remember which groups map to which nodes. This is for three reasons:
1. to be able to display all members of the group to the user
2. to be able to reverse the grouping and ungroup nodes
3. to be able to easily group together nodes that are already groups.

Process for grouping:
1. You create a new row/column for the group node
2. You collapse all existing links into the group node
3. You hide all the grouped nodes

You can tell if a node is a group if that node contains any links that are GROUP_MEMBER, or by accessing the type on the d object.

I chose to give the new nodes representing a group a negative id, so that it will never overlap with the id from a neo4j node.

### Generate Image of SVG
I chose to serialize the SVG to a string, then convert that to a blob url, and display the image by having an svg:image item link to the blob. This was much cleaner than embedding the image or canvas version of the SVG into an SVG foreign object. Update the url of the image link is also easy, meaning we don't have to remove the minimap item on the SVG every time we want to re-initialize it; we can simply replace the image URL.

A few difficulties occurred:
1. I had to remove the grid & zoom buttons from the target SVG so that they wouldn't display in the image
2. I had to append all the css as a defs in the svg to include it

### Minimap
The minimap has three areas of difficulty:
1. to be able to re-render as appropriate
2. to know where to put the box to start with and how large it should be; i.e. correlating the (total size of the SVG/size of viewport) to the (total size of minimap/ size of box)
3. to accurately translate and zoom the box and graph, involving:
  a. Dragging the minimap box should move the graph;
  b. Zooming out on the graph should make the minimap box smaller and still center around what's shown in the SVG viewport, meaning the box needs to translate appropriately while zooming.
  c. After zooming out on the graph, dragging the minimap box should move the graph MORE than before
  d. Panning on the graph should also move the minimap
  e. Right clicking/ making edits on the graph should NOT move the minimap

The workflow of the minimap is this:

Upon generation of the entire graph canvas in .generateCanvs():
  1. create a new Minimap instance;
  2. initialize the Minimap using the target SVG;

After initial loading period of x number of ticks:
  1. Render the minimap with the targetSVG and the boundaries of the SVG



