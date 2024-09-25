import { invertHex } from '@/utils/colors';

import styles from '../calendar.module.less';

/**
 * @export
 * @param info
 * @param ec
 * @link https://github.com/vkurko/calendar/issues/204
 */
export const generateEventHtml = (info, ec) => {

  // this is where I am escaping mounting on the pointer event
  // (the one that is used to drag, resize, select area etc.)
  // if needed you could for example check some event props,
  // to find out if mount was triggered by event you want to template
  if (info.event.id === '{pointer}') return;

  const result = { domNodes: [] };

  // extract the extended props from the event
  const {
    icon,
    name,
    email,
    phone,
    category,
    businessId,
    status
  } = info.event.extendedProps;

  const bgColor = info.event.backgroundColor || '#000000';

  const phoneElement = document.createElement('a');
  const emailElement = document.createElement('a');
  const businessElement = document.createElement('a');
  const nameElement = document.createElement('div');
  const categoryElement = document.createElement('div');
  const linksElement = document.createElement('div');

  const invertedColor = invertHex(bgColor);

  phoneElement.setAttribute('href', `tel:${phone}`);
  phoneElement.style.color = invertedColor;

  emailElement.setAttribute('href', `mailto:${email}`);
  emailElement.style.color = invertedColor;

  businessElement.setAttribute('href', `/businesses/${businessId}`);
  businessElement.style.color = invertedColor;

  linksElement.append(phoneElement);
  linksElement.append(emailElement);
  linksElement.append(businessElement);

  linksElement.classList.add(styles.links);

  nameElement.append(document.createTextNode(name));
  categoryElement.append(document.createTextNode(category));
  phoneElement.append(document.createTextNode(phone));
  emailElement.append(document.createTextNode(email));
  businessElement.append(document.createTextNode('business'));

  result.domNodes.push(nameElement);
  result.domNodes.push(categoryElement);
  result.domNodes.push(linksElement);

  info.event.title = result;

  ec?.updateEvent(info.event);
};