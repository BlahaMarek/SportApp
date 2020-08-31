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
      var presiel = [];
      var findFriend = false;
      var findSport = false;

      props.forEach((prop,key,arr) => {
        if (prop.field.toString() == 'date'){
          // @ts-ignore
          if (prop.value2 != 0){ // ked nevlozim druhy datum, preskakujem
            // @ts-ignore
            if (activity[prop.field] > prop.value && activity[prop.field] < prop.value2){
              presiel.push(true);
            }else {
              presiel.push(false)
            }
          }else{ // len podla 1. datumu
            if (activity[prop.field] > prop.value){
              presiel.push(true)

            }else{
              presiel.push(false);
            }
          }
        }

        if (prop.field.toString() != 'date') { // aby mi datum neporovnavalo
          if (activity[prop.field] == prop.value) {
           if (prop.field.toString()  === 'createdBy') {
             findFriend = true;

             if (findFriend == true) {
               presiel.push(true);
             }
          // @ts-ignore
             if(findFriend == false && props.length - 1 == key) {
               presiel.push(false);
             }
           }
           else if (prop.field.toString()  === 'sport'){
             findSport = true;
             console.log(key)
             console.log(props.length)

             if (key+1 == props.length || props[key+1].field.toString() != 'sport'){
               if (findSport == true){
                 presiel.push(true);
               }else presiel.push(false);
             }
           }
            else {
              presiel.push(true)
            }



            } else {
            if (prop.field  == "createdBy" && props.length - 1 == key) {
              presiel.push(false);
            }
            else if (prop.field == 'sport' && key+1 == props.length && findSport==false) {
              // if (key +1 == props.length && props[key + 1].field.toString() != 'sport' && findSport == false) {
              // }
              presiel.push(false)

            }
            else if (prop.field == 'sport' && findSport==false) {
              // if (key +1 == props.length && props[key + 1].field.toString() != 'sport' && findSport == false) {
              // }
              if (key +1 <= props.length && props[key+1].field.toString() != 'sport')
              presiel.push(false)

            }
            else if (prop.field == 'sport' && key+1 == props.length && findSport==true) {
              // if (key +1 == props.length && props[key + 1].field.toString() != 'sport' && findSport == false) {
              // }
              presiel.push(true)

            }
            else if (prop.field  != "createdBy" && prop.field != 'sport'){
              presiel.push(false)
            }
          }
        }


        if (Object.is(arr.length - 1, key)) { // ked som pri poslednom elemente

          var ano = presiel.every( (val, i, arr) => val === arr[0] ); //kontrojem ci su vsetky true
           if (ano && presiel[0] != false && presiel.length!=0) {
             filteredActivities.push(activity); //ak ano pushujem aktivitu
           }
        }
      })
    });
    //aby neboli duplikovane vysledky
    filteredActivities = Array.from(new Set(filteredActivities));
    return filteredActivities;
  }

}
