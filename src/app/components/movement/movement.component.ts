import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { GoogleMovementService, ICountry, ISubRegion, IEntity } from 'src/app/services/google-movement.service';

@Component({
  selector: 'app-movement',
  templateUrl: './movement.component.html',
  styleUrls: ['./movement.component.scss']
})
export class MovementComponent implements OnInit {

  @ViewChild('canvas', { static: false }) chart: BaseChartDirective;

  chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    title: {
      display: true,
      text: 'Mobility Changes'
    },
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day'
        },
        display: true
      }],
      yAxis: [{
        labelString: '%',
        ticks: {
          suggestedMin: -100,
          suggestedMax: 50,
        }
      }]
    }
  };

  xAxisLabels = [0];
  chartData = [
    { data: [], label: 'parks', fill: false },
    { data: [], label: 'grocery', fill: false },
    { data: [], label: 'residential', fill: false },
    { data: [], label: 'retail', fill: false },
    { data: [], label: 'transit', fill: false },
    { data: [], label: 'workplace', fill: false },
  ];

  public isLoading = true;

  countries: ICountry[] = [];
  subregions1: ISubRegion[] = [];
  subregions2: ISubRegion[] = [];

  data: IEntity[];

  private _selectedCountryName: string;
  private _selectedSubRegionName1: string;
  private _selectedSubRegionName2: string;

  private _selectedCountry: ICountry;
  private _selectedSubRegion1: ISubRegion;
  private _selectedSubRegion2: ISubRegion;

  constructor(private googleMovementService: GoogleMovementService) { }

  async ngOnInit() {
    this.countries = await this.googleMovementService.parseCSV2JSON();
    console.log('isLoading done');
    this.isLoading = false;
  }

  /**
   * When country is selected. get the list of sub-regions1
   */
  set selectedCountryName(value: string) {
    // reset subregions 1 and subregions 2.
    this.selectedSubRegionName1 = undefined;
    this.selectedSubRegionName2 = undefined;

    this._selectedCountryName = value;
    this._selectedCountry = this.countries.find(c => c.name === this._selectedCountryName);
    this.subregions1 = this._selectedCountry.regions;
    this.generateDataSet();
  }

  get selectedCountryName(): string {
    return this._selectedCountryName;
  }

  set selectedSubRegionName1(value: string) {
    this._selectedSubRegionName1 = value;
    this._selectedSubRegion1 = this.subregions1.find(r => r.name === this._selectedSubRegionName1);
    if (this._selectedSubRegion1) {
      this.subregions2 = this._selectedSubRegion1.regions;
    }
    this.selectedSubRegionName2 = undefined;
    this.generateDataSet();
  }

  get selectedSubRegionName1(): string {
    return this._selectedSubRegionName1;
  }

  set selectedSubRegionName2(value: string) {
    this._selectedSubRegionName2 = value;
    this._selectedSubRegion2 = this.subregions2.find(r => r.name === this._selectedSubRegionName2);
    this.generateDataSet();
  }

  get selectedSubRegionName2(): string {
    return this._selectedSubRegionName2;
  }

  private generateDataSet() {
    console.log('generateDataSet');
    if (this._selectedSubRegion2) {
      this.data = this._selectedSubRegion2.data;
    }
    else if (this._selectedSubRegion1) {
      // if sub-region1 selected.     
      this.data = this._selectedSubRegion1.data;
    } else if (this._selectedCountry) {
      // if country selected.
      this.data = this._selectedCountry.data;
    }

    if (this.data) {
      this.xAxisLabels.length = 0;
      // draw the graph.
      const sortedData = this.data.sort((a, b) => a.timestamp > b.timestamp ? 1 : -1);
      this.xAxisLabels = sortedData.map(d => d.timestamp);
      const parksData = sortedData.map(d => d.parks);
      const groceryData = sortedData.map(d => d.groceryPharmacy);
      const residentialData = sortedData.map(d => d.residential);
      const retailData = sortedData.map(d => d.retailRecreation);
      const transitData = sortedData.map(d => d.transit);
      const workplaceData = sortedData.map(d => d.workplace);
      this.chartData[0].data = parksData;
      this.chartData[1].data = groceryData;
      this.chartData[2].data = residentialData;
      this.chartData[3].data = retailData;
      this.chartData[4].data = transitData;
      this.chartData[5].data = workplaceData;
    }
  }

}
