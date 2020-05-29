import { Pipe, PipeTransform } from '@angular/core';
import {Activity} from "../models/activity";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: Activity[], props: {field: string, value: string}[]): any {
    if ( props.length == 0 ) {
      return value;
    }
    let filteredActivities = [];
    value.filter(activity => {

      props.forEach(prop => {
        if (activity[prop.field] != prop.value) {
          return false;
        }
        filteredActivities.push(activity);
        return  true;
      })

    });

    return filteredActivities;
  }

}
