import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})

export class ReviewsComponent implements OnInit {
  this_employee: any;
  tasks_ids: any;
  tasks: Array<Object>;
  total_reviews_count: any;
  avg_rate: any;
  constructor(private _httpService: HttpService, private _router: Router, private _route: ActivatedRoute) { }

  ngOnInit() {
    this.total_reviews_count = 0;
    this.avg_rate = 3;
    this.getEmployee()
  }

  getEmployee() {
    this._route.params.subscribe((params) => {
      let tempObservable = this._httpService.getEmployee(params['id']);
      tempObservable.subscribe((data: any) => {
        //console.log('data', data)
        this.tasks_ids = data["tasks"];
        this.this_employee = data;
        //console.log('this.tasks_ids2:', this.tasks_ids)
        for (var _id in this.tasks_ids) {
          this.getTask(_id);
          this.total_reviews_count += 1
        }
        this.getAvgRate();
      })
    })
  }

  getAvgRate() {
    var total_rate = 0;
    for (let task of this.tasks) {
      total_rate += task.review.rate
    }
    this.avg_rate = total_rate / this.total_reviews_count
  }

  getTask(_id: string) {
    let tempObservable = this._httpService.getTask(_id);
    tempObservable.subscribe((data: any) => {
      //console.log('get the editing restaurant:', data)
      this.tasks.push(data)
    })
  }

  removeReview(_id: string) {
    //console.log('task _id:', _id);
    let tempObservable = this._httpService.removeReview(_id);
    tempObservable.subscribe(data => {
      console.log("Removed Review:", data);
      this.getEmployee();
    })
  }
}
