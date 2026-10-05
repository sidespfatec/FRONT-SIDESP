import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

import { BannerComponent } from '../../../component/banner/banner.component';
import { FooterComponent } from '../../../component/footer/footer.component';
import { NavbarDesktopAdminComponent } from '../../../component/navbar-desktop-admin/navbar-desktop-admin.component';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';

interface Hub {
    id: number;
    name: string;
    neighborhood: string;
    active: boolean;
    lat: number;
    lng: number;
}

@Component({
    selector: 'app-manage-hubs',
    imports: [
        BannerComponent, FooterComponent, NavbarDesktopAdminComponent,
        CardModule, ButtonModule, InputTextModule, TagModule
    ],
    templateUrl: './manage-hubs.component.html',
    styleUrl: './manage-hubs.component.scss'
})
export class ManageHubsComponent implements AfterViewInit, OnDestroy {
    private map!: L.Map;

    hubs: Hub[] = [
        { id: 1, name: 'Sede', neighborhood: 'Centro', active: true, lat: -22.8165, lng: -45.1925 },
        { id: 2, name: 'Polo Pedregulho', neighborhood: 'Pedregulho', active: true, lat: -22.7925, lng: -45.179 },
        { id: 3, name: 'Polo Campo do Galvão', neighborhood: 'Campo do Galvão', active: true, lat: -22.835, lng: -45.215 }
    ];

    ngAfterViewInit() {
        this.map = L.map('hub-map', { zoomControl: false }).setView([-22.816, -45.193], 12);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

        this.hubs.forEach(hub => {
            L.circleMarker([hub.lat, hub.lng], { radius: 8, color: '#fff', fillColor: '#0D1282', fillOpacity: 1 })
                .bindTooltip(hub.name)
                .addTo(this.map);
        });
    }

    ngOnDestroy() {
        this.map.remove();
    }

    toggleStatus(hub: Hub) {
        this.hubs = this.hubs.map(h =>
            h.id === hub.id ? { ...h, active: !h.active } : h
        );
    }
}