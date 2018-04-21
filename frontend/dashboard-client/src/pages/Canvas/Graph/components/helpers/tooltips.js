// function initializeTooltip() {
//   $('body').append("<div id='node-tooltip'></div>");
//   this.hideTooltip();
// }

// function displayTooltip(d) {
//   const attrs = ['id', 'name', 'type'];
//   this.displayData('node-tooltip', processNodeName(d.name), this.populateNodeInfoBody, d, attrs);
//   this.moveTooltip(d);
//   $('#node-tooltip').show();
// }

// function moveTooltip(d) {
//   const offset = 30;
//   const xPos = d.x * this.zoomScale + this.zoomTranslate[0] + offset;
//   const yPos = d.y * this.zoomScale + this.zoomTranslate[1] + offset;
//   $('#node-tooltip').css('left', `${xPos}px`)
//                     .css('top', `${yPos}px`);
// }

// function hideTooltip() {
//   $('#node-tooltip').hide();
// }

// function populateNodeInfoBody(targetId, info, attrs) {
//   if (attrs && !this.debug) {
//     for (let attr of attrs) {
//       $(targetId).append(createInfoTextEntry(attr, info[attr]));
//       if (typeof info[attr] === 'undefined' && info['type'] != 'Document') {
//         console.error(`${attr} is not a valid attribute.`);
//       }
//     }
//   } else {
//     for (let key in info) {
//       $(targetId).append(createInfoTextEntry(key, info[key]));
//     }
//   }
// }

// function displayData(targetId, titleText, populateBody) {
//   $(`#${targetId}`).html('');

//   const sectionTitle = this.createTitleElement(titleText);
//   sectionTitle.id = `${targetId}-title`;
//   const titleId = `#${sectionTitle.id}`;

//   const sectionBody = document.createElement('div');
//   sectionBody.id = `${targetId}-body`; 
//   const bodyId = `#${sectionBody.id}`;

//   sectionTitle.onclick = () => {
//     $(bodyId).css('max-height',  $(titleId).hasClass('open') ? 0 : maxHeight);
//     $(titleId).toggleClass('open');
//   }

//   if (arguments.length > 3) {
//     const args = Array.prototype.slice.call(arguments, 3);
//     args.unshift(sectionBody);
//     populateBody.apply(null, args);
//   } else {
//     populateBody(sectionBody);
//   }

//   $(`#${targetId}`).append(sectionTitle);
//   $(`#${targetId}`).append(sectionBody);
// }

// function createInfoTextEntry(key, value) {
//   const leftText = createTextElement('tooltip-left', key);
//   const rightText = createTextElement('tooltip-right', value);
//   const contentEntry = createDivElement('content-entry');
//   $(contentEntry).append(leftText);
//   $(contentEntry).append(rightText);
//   return contentEntry;
// }

// function createTitleElement(title, close=false) {
//   const titleElement = createDivElement('tooltip-title');
//   const titleText = document.createElement('p');
//   titleText.className = 'unselectable';
//   titleText.innerHTML = title;
//   $(titleElement).append(titleText);

//   if (close) {
//     const icon = document.createElement('i');
//     icon.className = 'fa fa-close';
//     $(titleElement).append(icon);
//   }

//   return titleElement;
// }

// function createTextElement(className, text) {
//   const textElement = createDivElement(className);
//   textElement.innerHTML = text;
//   return textElement;
// }

// function createDivElement(className) {
//   const divElement = document.createElement('div');
//   divElement.className = className;
//   return divElement;
// }
