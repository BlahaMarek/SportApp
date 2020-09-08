import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Chart } from 'chart.js';
import {ActivityService} from "../../services/activity.service";
import {forEach} from "@angular-devkit/schematics";
import {DataService} from "../../data/data.service";
import {Activity} from "../../models/activity";
import {EventService} from "../../services/event.service";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {

  // @ts-ignore
  @ViewChild("barCanvas") barCanvas: ElementRef;
  // @ts-ignore
  @ViewChild("doughnutCanvas") doughnutCanvas: ElementRef;
  // @ts-ignore
  @ViewChild('lineCanvas') lineCanvas: ElementRef;

  private barChart: Chart;
  private doughnutChart: Chart;
  private lineChart: Chart;
  constructor(private activityService:ActivityService, private dataService:DataService, private eventService:EventService) { }

  pondelok:number = 0;
  utorok:number = 0;
  streda:number = 0;
  stvrtok:number = 0;
  piatok:number = 0;
  sobota:number = 0;
  nedela:number = 0;

  sporty= [];
  pocetSportov=[];

  ngOnInit() {
    let list:Activity[] = [];
    var aktivity = this.activityService.activities.concat(this.eventService.eventss);
    list = aktivity.filter(activity => activity.createdBy === this.dataService.getSignInUser().id);
    aktivity.filter(activity => activity.bookedBy.forEach(value =>  {
      if (value == this.dataService.getSignInUser().id) {
        list.push(activity);
      }
    }));
    list.forEach(den => {
      switch (new Date(den.date).getDay()){
        case 1:
          this.pondelok++;
          break;
        case 2:
          this.utorok++;
          break;
        case 3:
          this.streda++;
          break;
        case 4:
          this.stvrtok++;
          break;
        case 5:
          this.piatok++;
          break;
        case 6:
          this.sobota++;
          break;
        case 7:
          this.nedela++;
          break;

      }
    });

    //tu filtrujem sporty
    list.forEach(aktivity => {
      this.sporty.push(this.dataService.getSportNameByValue(aktivity.sport));

    })
    var counts = [];
    this.sporty.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

    counts = Object.keys(counts).map(key => counts[key]);
    this.pocetSportov = counts;
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: "bar",
      data: {
        labels: ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota", "Nedeľa"],
        datasets: [
          {
            // label: "počet športov",
            data: [this.pondelok, this.utorok,this.streda, this.stvrtok, this.piatok, this.sobota,this.nedela],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(100, 0, 150, 0.2)"
            ],
            borderColor: [
              "rgba(255,99,132,1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
              "rgba(100, 0, 150, 1)"
            ],
            borderWidth: 1
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
              return tooltipItem.yLabel;
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        }
      }
    });

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: "doughnut",
      data: {
        labels: Array.from(new Set(this.sporty)),
        datasets: [
          {
            label: "# of Votes",
            data: counts,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF6384", "#36A2EB", "#FFCE56"]
          }
        ]
      }
    });

    // this.lineChart = new Chart(this.lineCanvas.nativeElement, {
    //   type: "line",
    //   data: {
    //     labels: ["January", "February", "March", "April", "May", "June", "July"],
    //     datasets: [
    //       {
    //         label: "My First dataset",
    //         fill: false,
    //         lineTension: 0.1,
    //         backgroundColor: "rgba(75,192,192,0.4)",
    //         borderColor: "rgba(75,192,192,1)",
    //         borderCapStyle: "butt",
    //         borderDash: [],
    //         borderDashOffset: 0.0,
    //         borderJoinStyle: "miter",
    //         pointBorderColor: "rgba(75,192,192,1)",
    //         pointBackgroundColor: "#fff",
    //         pointBorderWidth: 1,
    //         pointHoverRadius: 5,
    //         pointHoverBackgroundColor: "rgba(75,192,192,1)",
    //         pointHoverBorderColor: "rgba(220,220,220,1)",
    //         pointHoverBorderWidth: 2,
    //         pointRadius: 1,
    //         pointHitRadius: 10,
    //         data: [65, 59, 80, 81, 56, 55, 40],
    //         spanGaps: false
    //       }
    //     ]
    //   }
    // });
  }
 // numberOfSports(){
 //    var
 //
 // }

}
