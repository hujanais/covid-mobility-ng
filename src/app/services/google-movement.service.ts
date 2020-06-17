import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface IEntity {
  timestamp: number,
  retailRecreation: number,
  groceryPharmacy: number,
  parks: number,
  transit: number,
  workplace: number,
  residential: number,
}

export interface ICountry {
  code: string,
  name: string,
  data: IEntity[],
  regions: ISubRegion[]
}

export interface ISubRegion {
  name: string,
  data: IEntity[],
  regions: ISubRegion[]
}

export interface IMetaData {
  name: string;
  subregion: IMetaData[];
}

export enum Columns {
  CountryCode = 0,
  CountryName = 1,
  SubRegion1 = 2,
  SubRegion2 = 3,
  ISO3166 = 4,
  FIPS = 5,
  Date = 6,
  Retail = 7,
  Grocery = 8,
  Parks = 9,
  Transit = 10,
  Workplace = 11,
  Residential = 12,
}

@Injectable({
  providedIn: 'root'
})

export class GoogleMovementService {

  private countries: ICountry[] = [];

  constructor(private httpClient: HttpClient) { }

  async parseCSV2JSON(): Promise<ICountry[]> {

    return new Promise((resolve, reject) => {
      this.httpClient.get('assets/Global_Mobility_Report_June15.csv', { responseType: 'text' }).subscribe(data => {
        const CR = '\n';
        var lines = data.split(CR);
        // Step 1. extract the header.
        const header = lines.shift();
        const columnKeys = header.split(',');
        // console.log(columnKeys);

        lines.forEach(line => {
          let columnData = line.split(',');
          let countryCode = columnData[Columns.CountryCode];
          let countryName = columnData[Columns.CountryName];
          let subRegionName1 = columnData[Columns.SubRegion1];
          let subRegionName2 = columnData[Columns.SubRegion2];

          const entity: IEntity = {
            timestamp: Date.parse(columnData[Columns.Date]),
            retailRecreation: parseFloat(columnData[Columns.Retail]),
            groceryPharmacy: parseFloat(columnData[Columns.Grocery]),
            parks: parseFloat(columnData[Columns.Parks]),
            transit: parseFloat(columnData[Columns.Transit]),
            workplace: parseFloat(columnData[Columns.Workplace]),
            residential: parseFloat(columnData[Columns.Retail]),
          };

          let country: ICountry;
          let region: ISubRegion;
          let subregion: ISubRegion;
          let isSubRegion1 = (subRegionName1 && subRegionName1.length > 0);
          let isSubRegion2 = (subRegionName2 && subRegionName2.length > 0);

          // step a. see if country already exist.
          country = this.countries.find(c => c.name === countryName);
          if (!country) {
            // a new country is found.
            country = { code: countryCode, name: countryName, data: (isSubRegion1 || isSubRegion2) ? [] : [entity], regions: [] };
            this.countries.push(country);
          }
          // step b. see if subregion1 exists.
          if (isSubRegion1) {
            region = country.regions.find(r => r.name === subRegionName1);
            if (!region) {
              region = { name: subRegionName1, data: [], regions: [] };
              country.regions.push(region);
            }
          }
          // step c. see if subregion2 exists.
          if (isSubRegion2) {
            subregion = region.regions.find(r => r.name === subRegionName2);
            if (!subregion) {
              subregion = { name: subRegionName2, data: [], regions: [] };
              region.regions.push(subregion);
            }
          }

          // add the data.
          if (isSubRegion2) {
            // this is a subregion2 data.
            subregion.data.push(entity);
          } else if (isSubRegion1) {
            // this is a subregion1 data.
            region.data.push(entity);
          } else {
            // this is a country data.
            country.data.push(entity);
          }
        });
        console.log('csv done');
        this.countries = this.countries.sort((a, b) => (a.name > b.name) ? 1 : -1);
        resolve(this.countries);
      }, error => {
        console.log('fubar');
        reject(this.countries);
      });

    });
  }
}