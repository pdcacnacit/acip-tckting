import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customerNameCell'
})
export class CustomerNameCellPipe implements PipeTransform {

  transform(workOrder: any, args?: any): any {
    let brokenAddress = workOrder.customerAddress;
    let commaIndex = workOrder.customerAddress.indexOf(",");
    if (commaIndex > 0 && commaIndex < workOrder.customerAddress.length - 1) {
        let firstLine = workOrder.customerAddress.substr(0, commaIndex);
        let secondLine = workOrder.customerAddress.substr(commaIndex + 1).trim();
        brokenAddress = firstLine + "<br>" + secondLine;
    }
    return workOrder.customerName + "<br><a href=http://maps.apple.com/?q=\"" + encodeURIComponent(brokenAddress) + "role=\"button\" class=\"btn btn-link btn-map-link\">" + brokenAddress + "</a>";
  }

}
