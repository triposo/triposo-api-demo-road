import { extendObservable, computed } from "mobx";
import Location from "./Location";
import { apiRequest } from "../utils";

export default class Poi {
  constructor(json = null) {
    extendObservable(this, {
      id: null,
      name: "",
      hover: false,
      locationId: null,
      location: null,
      images: [],
      tags: [],
      coordinates: null,
      mediumImage: computed(this.getMediumImage)
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

  fetchLocation() {
    if (this.locationId === null) {
      return Promise.reject("Missing location id");
    }
    if (this.location !== null) return Promise.resolve(this.location);
    return apiRequest(`location.json?id=${this.locationId}`).then(json => {
      if (json.results.length) {
        let loc = new Location();
        loc.fromJSON(json.results[0]);
        this.location = loc;
        return Promise.resolve(this.location);
      }
    });
  }

  fromJSON(json) {
    this.id = json.id;
    this.name = json.name;
    this.images = json.images;
    this.locationId = json.location_id;
    this.coordinates = json.coordinates;
    if (json.tags) this.tags = json.tags;
  }

  reset() {
    this.id = null;
  }
}
