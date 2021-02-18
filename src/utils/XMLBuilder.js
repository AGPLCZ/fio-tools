export default class XMLBuilder {
  constructor() {
    if (this instanceof XMLBuilder) {
      throw Error("A static class cannot be instantiated.");
    }
  }

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

  static add(doc, target, name, value) {
    var elem = doc.createElement(name);
    elem.appendChild(doc.createTextNode(value));
    target.appendChild(elem);
  }

  static createItemCZ(doc, payment, account, today) {
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
    this.add(doc, domesticElem, "date", today);
    this.add(doc, domesticElem, "messageForRecipient", payment.messageTo);
    this.add(doc, domesticElem, "comment", payment.messageFrom);
    this.add(doc, domesticElem, "paymentType", payment.type);
    return domesticElem;
  }

  static addItems(doc, payments, account) {
    const today = new Date().toISOString().slice(0, 10);
    var ordersElem = doc.createElement("Orders");
    //TODO sort based on types
    payments.forEach((payment) => {
      if (payment.valid)
        ordersElem.appendChild(this.createItemCZ(doc, payment, account, today));
    });
    return ordersElem;
  }

  static build(payments, account) {
    var doc = document.implementation.createDocument("", "", null);
    var importElem = this.getImportElem(doc);
    importElem.appendChild(this.addItems(doc, payments, account));
    doc.appendChild(importElem);
    return new XMLSerializer().serializeToString(doc);
  }
}
