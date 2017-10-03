import { extendObservable, computed } from "mobx";
import { apiRequest } from "../utils";

export default class Location {
  constructor(json = null) {
    extendObservable(this, {
      id: null,
      name: "",
      type: "",
      countryId: null,
      country: null,
      images: [],
      mediumImage: computed(this.getMediumImage),
      isCity: computed(() => {
        return this.type === "city";
      })
    });
    if (json) this.fromJSON(json);
  }

  getMediumImage = () => {
    if (this.images.length) {
      if (this.images[0].sizes.medium) return this.images[0].sizes.medium.url;
      if (this.images[0].sizes.thumbnail)
        return this.images[0].sizes.thumbnail.url;
    }
    return "/placeholder.jpg";
  };

  getOriginalImage = () => {
    if (this.images.length) {
      if (this.images[0].sizes.original)
        return this.images[0].sizes.original.url;
      if (this.images[0].sizes.medium) return this.images[0].sizes.medium.url;
    }
    return "/placeholder.jpg";
  };

  fetchCountry() {
    if (this.countryId === null) return Promise.reject("Missing country id");
    return apiRequest(`location.json?id=${this.countryId}`).then(json => {
      if (json.results.length) {
        let loc = new Location();
        loc.fromJSON(json.results[0]);
        this.country = loc;
        return Promise.resolve(this.country);
      }
    });
  }

  fromJSON(json) {
    this.id = json.id;
    this.name = json.name;
    this.images = json.images;
    this.type = json.type;
    this.countryId = json.country_id;
  }

  reset() {
    this.id = null;
  }
}
