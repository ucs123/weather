import { Component, OnInit, Output } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidatorFn
} from "@angular/forms";
import { DataService } from "../data.service";

@Component({
  selector: "app-searchbox",
  templateUrl: "./searchbox.component.html",
  styleUrls: ["./searchbox.component.scss"]
})
export class SearchboxComponent implements OnInit {
  wloader = false;
  formGroup: FormGroup;
  dateModel: Date = new Date();
  cityname;
  stringDateModel: string = new Date().toString();
  apiurlweather = "http://api.openweathermap.org/data/2.5/weather?q=";
  apikey = "&APPID=5f25a4c6568e937957b82e1afe8c1821";
  weatherlocalurl = "https://lncropsiteapi.herokuapp.com/weather";
  weatherData: any[];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.formGroup = new FormGroup(
      {
        activeEndDate: new FormControl(new Date(), {
          validators: [Validators.required, DateTimeValidator]
        }),
        activeStartDate: new FormControl(new Date(), {
          validators: [Validators.required, DateTimeValidator]
        })
      },
      { updateOn: "change" }
    );
  }
  formatdate = str => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [mnth, day, date.getFullYear()].join("-");
  };

  weatherHandler = $event => {
    this.wloader =true;
    let requestUrl = this.apiurlweather + this.cityname + this.apikey;
    let startdate = this.formatdate(this.formGroup.value.activeStartDate);
    let enddate = this.formatdate(this.formGroup.value.activeEndDate);
    let requestBody;

    let todaydt = this.formatdate(new Date());
    if (startdate == enddate || enddate > todaydt) {
      alert(
        "Please select valid dates, check start and end dates, end date can not be future dates and start date can not be equal to end dates."
      );
      this.wloader =false;
      return false;
    }
    if (enddate == todaydt) {
      this.dataService.sendGetRequest(requestUrl).subscribe((data: any) => {
        requestBody = {
          date: data.dt,
          weather: data.weather[0].description,
          weather_icon: data.weather[0].icon,
          temp: data.main.temp,
          temp_min: data.main.temp_min,
          temp_max: data.main.temp_max,
          air_speed: data.wind.speed,
          pressure: data.main.pressure,
          humidity: data.main.humidity,
          city: this.cityname
        };
        this.dataService
          .sendPostRequest(this.weatherlocalurl, requestBody)
          .subscribe(
            res => {
              console.log(res);
              this.dataService
                .sendGetRequest(
                  this.weatherlocalurl +
                    ":" +
                    this.cityname +
                    "&" +
                    startdate +
                    "&" +
                    enddate
                )
                .subscribe((data: any[]) => {
                  this.weatherData = data;
                  this.wloader =false;
                });
            },
            err => console.log(err)
          );
      });
    } else {
      this.dataService
        .sendGetRequest(
          this.weatherlocalurl +
            ":" +
            this.cityname +
            "&" +
            startdate +
            "&" +
            enddate
        )
        .subscribe((data: any) => {
          if (data && data.length) {
            if (
              data &&
              data[0].city.toLowerCase() == this.cityname.toLowerCase()
            ) {
              this.weatherData = data;
              this.wloader =false;
            }
          } else {
            this.dataService
              .sendGetRequest(requestUrl)
              .subscribe((data: any) => {
                requestBody = {
                  date: data.dt,
                  weather: data.weather[0].description,
                  weather_icon: data.weather[0].icon,
                  temp: data.main.temp,
                  temp_min: data.main.temp_min,
                  temp_max: data.main.temp_max,
                  air_speed: data.wind.speed,
                  pressure: data.main.pressure,
                  humidity: data.main.humidity,
                  city: this.cityname
                };
                this.weatherData = [requestBody];
                this.wloader =false;
                this.dataService
                  .sendPostRequest(this.weatherlocalurl, requestBody)
                  .subscribe(res => console.log(res), err => console.log(err));
              });
          }
        });
    }
  };
}
export const DateTimeValidator = (fc: FormControl) => {
  const date = new Date(fc.value);
  const isValid = !isNaN(date.valueOf());
  return isValid
    ? null
    : {
        isValid: {
          valid: false
        }
      };
};
