import { Pipe, PipeTransform } from '@angular/core';
import {Activity} from "../models/activity";
import {DataService} from "../data/data.service";

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  constructor( private dataService: DataService) {
  }

  transform(value: Activity[], props: {field: string, value: string}[], group: string): any {

    let list = [];
    // FILTROVANIE AKTIVIT PODLA SEGMENTOV (AKTIVITY OSTATNYCH/MOJE/NA KTORYCH SOM PRIHLASENY

    // TAKE AKTIVITY, KT. SOM NEVYTVORIL && SU TAM ESTE VOLNE MIESTA && ESTE SA NEODOHRALA && ESTE SOM SA NA NU NEPRIHLASIL
    if( group == 'others' ) {
      list = value.filter(activity => ((activity.createdBy !== this.dataService.getSignInUser().id) &&
          (activity.peopleCount > activity.bookedBy.length) && (new Date(activity.date).getTime() >= (new Date()).getTime()) && !activity.bookedBy.includes(this.dataService.getSignInUser().id)));
    }
    // TAKE AKTIVITY, KT. SOM VYTVORIL JA
    else if ( group == 'mine' ) {
      list = value.filter(activity => activity.createdBy === this.dataService.getSignInUser().id);

      list.sort( (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    // TAKE AKTIVITY, NA KT. SOM SA PRIHLASIL
    else if ( group == 'registered' ) {
      value.filter(activity => activity.bookedBy.forEach(value =>  {
        if (value == this.dataService.getSignInUser().id) {
          list.push(activity);
        }
      }));

      list.sort( (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // AK JE FILTRACNY FORMULAR PRAZDNY, VRATIM VSETKY AKTIVITY PODLA SEGMENTU
    if ( props.length == 0 ) {
      return list;
    }

    // FILTRUJEM PODLA POLI FILTRACNEHO FORMULARA
    let filteredActivities = [];
    var i = 0;
    list.filter(activity => {
      props.forEach(prop => {
        console.log(prop) // to co som dostal
        // console.log(prop.field) // to co som dostal --date
        // console.log(activity[prop.field]);// tu mam uz timestamp aktivity
        // console.log(prop.value);


        if (prop.field.toString() != 'date'){ // aby mi datum neporovnavalo
          if (activity[prop.field] != prop.value) return false;
        }

        if (prop.field.toString() == 'date'){
          // @ts-ignore
          if (prop.value2 != 0){ // ked nevlozim druhy datum, preskakujem
            // @ts-ignore
            if (activity[prop.field] > prop.value && activity[prop.field] < prop.value2){
              filteredActivities.push(activity);
              console.log("pushujem");
              return true;
            }
          }else{ // len podla 1. datumu
            console.log("mnel by som byt tu")
            if (activity[prop.field] > prop.value){
              filteredActivities.push(activity);
              console.log("pushujem");
              return true;
            }
          }
        }

        if (activity[prop.field] == prop.value){
          filteredActivities.push(activity);
        }
      })
    });
    //aby neboli duplikovane vysledky
    filteredActivities = Array.from(new Set(filteredActivities));
    return filteredActivities;
  }

}
