import {
  Component,
  OnInit,
  OnChanges,
  Input,
  SimpleChanges
} from "@angular/core";

@Component({
  selector: "app-search-result",
  templateUrl: "./search-result.component.html",
  styleUrls: ["./search-result.component.scss"]
})
export class SearchResultComponent implements OnInit {
  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;

  @Input() wdata;

  weatherResult;

  constructor() {}

  ngOnInit() {
    this.weatherResult = this.wdata;
  }
  ngOnChanges() {
    this.weatherResult = this.wdata;
  }
  exportWeather = () => {
    window.print();
  };
  sortFunc (a, b) {
    return a.date - b.date
  }
  saveWeather = () => {
    console.log("save sucessfully");
  };
  convertDate = timestamp => {
    let date = new Date(timestamp * 1000);
    let cdate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    return cdate;
  };
}
