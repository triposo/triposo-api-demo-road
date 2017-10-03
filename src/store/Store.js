import { extendObservable, computed, action } from "mobx";
import Location from "./Location";
import Poi from "./Poi";
import { apiRequest } from "../utils";

export default class Store {
  constructor() {
    extendObservable(this, {
      loading: 0,
      startPoint: null,
      endPoint: null,
      startLocation: null,
      endLocation: null,
      distance: 0,
      duration: 0,
      polyline: null,
      highlights: [],
      isLoading: computed(() => this.loading > 0)
    });
  }

  setRoute(leg, polyline) {
    this.distance = leg.distance.value;
    this.duration = leg.duration.value;
    this.polyline = polyline;

    Promise.all([
      this.fetchLocationByLatLng(this.startPoint.lat, this.startPoint.lng),
      this.fetchLocationByLatLng(this.endPoint.lat, this.endPoint.lng)
    ])
      .then(
        action(locs => {
          this.startLocation = locs[0];
          this.endLocation = locs[1];
        })
      )
      .then(() => {
        this.fetchHighlights(polyline).then(
          result => {
            console.log(result);
            this.highlights = result
          }
        );
      });
  }

  setLoading(isLoading) {
    this.loading = isLoading ? this.loading + 1 : Math.max(0, this.loading - 1);
  }

  fetchLocationByLatLng(lat, lng) {
    this.setLoading(true);

    return apiRequest(
      `location.json?tag_labels=city&annotate=distance:${lat},${lng}&distance=<=20000&count=1&order_by=distance`
    ).then(
      json => {
        this.setLoading(false);
        if (json.results.length) return new Location(json.results[0]);
        return null;
      },
      fail => {
        this.setLoading(false);
        console.log(fail);
      }
    );
  }

  fetchHighlights(polyline) {
    this.setLoading(true);
    let distance = 50000;

    //we don't want sights in start or end destinations
    let exclude = "";
    if (this.startLocation.id)
      exclude += `&location_id=!${this.startLocation.id}`;
    if (this.endLocation.id) exclude += `&location_id=!${this.endLocation.id}`;

    let query = `poi.json?tag_labels=sightseeing&annotate=distance:${polyline}&distance=<${distance}&score=>=6${exclude}`;
    console.log(query);

    return apiRequest(
      query
    ).then(
      response => {
        console.log(response);
        this.setLoading(false);
        if (response.results) {
          return response.results.map(r => new Poi(r));
        }
        return [];
      },
      fail => {
        console.log(fail);
        this.setLoading(false);
      }
    );
  }
}
