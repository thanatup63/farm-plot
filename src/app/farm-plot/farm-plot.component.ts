import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

declare var bootstrap: any;
declare var google: any;

@Component({
  selector: 'app-farm-plot',
  templateUrl: './farm-plot.component.html',
  styleUrls: ['./farm-plot.component.css']
})
export class FarmPlotComponent implements OnInit {
  @ViewChild('map', { static: false }) mapElement!: ElementRef;
  plots: any[] = [];
  selectedPlot: any = {};
  isEditing = false;
  map: any;
  polygon: any;
  markers: any[] = [];
  currentImageUrl: string = '';

  constructor() {}

  ngOnInit(): void {
    this.loadMap();
  }

  loadMap(): void {
    const mapProperties = {
      center: new google.maps.LatLng(19.026951, 99.901808),
      zoom: 8,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);

    this.polygon = new google.maps.Polygon({
      paths: [],
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      editable: true,
      map: this.map
    });

    google.maps.event.addListener(this.map, 'click', (event: any) => {
      this.addMarker(event.latLng);
    });
  }

  addMarker(location: any): void {
    const marker = new google.maps.Marker({
      position: location,
      map: this.map
    });
    this.markers.push(marker);

    const path = this.polygon.getPath();
    path.push(location);
  }

  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
    this.polygon.setPath([]);
  }

  onSubmit(): void {
    if (this.isEditing) {
      const index = this.plots.findIndex(plot => plot === this.selectedPlot);
      this.plots[index] = this.selectedPlot;
    } else {
      this.plots.push({ ...this.selectedPlot, mapImageUrl: 'https://via.placeholder.com/150' });
    }

    this.resetForm();

    // Close the modal after submission
    const plotModal = bootstrap.Modal.getInstance(document.getElementById('plotModal'));
    if (plotModal) {
      plotModal.hide();
    }
  }

  editPlot(plot: any): void {
    this.selectedPlot = { ...plot };
    this.isEditing = true;
    const plotModal = new bootstrap.Modal(document.getElementById('plotModal'));
    plotModal.show();
  }

  deletePlot(plot: any): void {
    this.plots = this.plots.filter(p => p !== plot);
  }

  viewDetails(plot: any): void {
    this.selectedPlot = { ...plot };
    const detailsModal = new bootstrap.Modal(document.getElementById('detailsModal'));
    detailsModal.show();
  }

  resetForm(): void {
    this.selectedPlot = {};
    this.isEditing = false;
    this.clearMarkers();
  }

  openImageModal(imageUrl: string): void {
    this.currentImageUrl = imageUrl;
    const imageModal = new bootstrap.Modal(document.getElementById('imageModal'));
    imageModal.show();
  }

  useCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const currentPos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.setCenter(currentPos);
        this.addMarker(currentPos);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
}
