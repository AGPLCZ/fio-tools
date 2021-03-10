export default class XMLBuilder {
  constructor() {
    if (this instanceof XMLBuilder) {
      throw Error("A static class cannot be instantiated.");
    }
  }

  /**
   * Create import element with necessary attributes
   * @param {xml object} doc 
   * @returns import element of xml
   */
  static getImportElem(doc) {
    var importElem = doc.createElement("Import");
    importElem.setAttribute(
      "xmlns:xsi",
      "http://www.w3.org/2001/XMLSchema-instance"
    );
    importElem.setAttribute(
      "xsi:noNamespaceSchemaLocation",
      "http://www.fio.cz/schema/importIB.xsd"
    );
    return importElem;
  }

  /**
   * Create new element as child of "target" with name "name" and value "value"
   * @param {xml object} doc 
   * @param {parent element} target 
   * @param {element name} name 
   * @param {value of new element} value 
   */
  static add(doc, target, name, value) {
    var elem = doc.createElement(name);
    elem.appendChild(doc.createTextNode(value));
    target.appendChild(elem);
  }

  /**
   * @param {xml object} doc 
   * @param {payment item} payment 
   * @param {source account} account 
   * @returns DomesticTransaction element with all necessary parameters and values
   */
  static createItemCZ(doc, payment, account) {
    var accountSplitted = payment.account.split("/");
    var domesticElem = doc.createElement("DomesticTransaction");
    this.add(doc, domesticElem, "accountFrom", account);
    this.add(doc, domesticElem, "currency", payment.currency);
    this.add(doc, domesticElem, "amount", payment.amount);
    this.add(doc, domesticElem, "accountTo", accountSplitted[0]);
    this.add(doc, domesticElem, "bankCode", accountSplitted[1]);
    this.add(doc, domesticElem, "ks", payment.ks);
    this.add(doc, domesticElem, "vs", payment.vs);
    this.add(doc, domesticElem, "ss", payment.ss);
    this.add(doc, domesticElem, "date", payment.date);
    this.add(doc, domesticElem, "messageForRecipient", payment.messageTo);
    this.add(doc, domesticElem, "comment", payment.messageFrom);
    this.add(doc, domesticElem, "paymentType", payment.type);
    return domesticElem;
  }

  /**
   * @param {xml object} doc 
   * @param {payments array of payment items} payments 
   * @param {source account} account 
   * @returns Orders element with payments as children
   */
  static addItems(doc, payments, account) {
    var ordersElem = doc.createElement("Orders");
    payments.forEach((payment) => {
      if (payment.valid)
        ordersElem.appendChild(this.createItemCZ(doc, payment, account));
    });
    return ordersElem;
  }

  /**
   * @param {payments array of payment items} payments 
   * @param {source account} account 
   * @returns payments as structured XML object as string
   */
  static build(payments, account) {
    var doc = document.implementation.createDocument("", "", null);
    var importElem = this.getImportElem(doc);
    importElem.appendChild(this.addItems(doc, payments, account));
    doc.appendChild(importElem);
    return new XMLSerializer().serializeToString(doc);
  }
}
