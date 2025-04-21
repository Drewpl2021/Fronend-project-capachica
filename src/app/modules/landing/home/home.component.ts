import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html', // Esto asegura que los estilos se apliquen globalmente
    styleUrls: [
        '../../../../assets/css/animate.css',
        '../../../../assets/css/owl.carousel.min.css',
        '../../../../assets/css/owl.theme.default.min.css',
        '../../../../assets/css/magnific-popup.css',
        '../../../../assets/css/bootstrap-datepicker.css',
        '../../../../assets/css/jquery.timepicker.css',
        '../../../../assets/css/flaticon.css',
        '../../../../assets/css/style.css'
    ],
    standalone: true,
    imports: [
        MatButtonModule,
        RouterLink,
        MatIconModule,
        CommonModule
    ],
})
export class LandingHomeComponent implements OnInit {
    // Current year for footer copyright
    currentYear: number = new Date().getFullYear();

    // Sample data for destinations
    destinations = [
        {
            id: 1,
            name: 'Llachon',
            location: 'Capachica, Puno',
            price: '$120',
            days: 2,
            image: 'assets/images/llachon.jpg',
            showers: '2',
            beds: '3',
            feature: 'Lakeside view',
            featureIcon: 'landscape'
        },
        {
            id: 2,
            name: 'Chifrón',
            location: 'Capachica, Puno',
            price: '$150',
            days: 3,
            image: 'assets/images/chifron.jpg',
            showers: '1',
            beds: '2',
            feature: 'Mountain view',
            featureIcon: 'terrain'
        },
        {
            id: 3,
            name: 'Escallani',
            location: 'Capachica, Puno',
            price: '$100',
            days: 1,
            image: 'assets/images/escallani.jpg',
            showers: '1',
            beds: '2',
            feature: 'Local homestay',
            featureIcon: 'home'
        }
    ];

    // Sample data for testimonials
    testimonials = [
        {
            name: 'Maria Rodriguez',
            position: 'Tourist from Spain',
            content: 'Our stay in Capachica was magical! The homestay experience allowed us to connect deeply with the local culture and the views of Lake Titicaca were breathtaking.',
            image: 'assets/images/testimonial-1.jpg',
            stars: 5
        },
        {
            name: 'John Smith',
            position: 'Travel Blogger',
            content: 'The authenticity of Capachica truly sets it apart from more touristy destinations around Lake Titicaca. The locals welcomed us warmly and the hiking trails offered spectacular views.',
            image: 'assets/images/testimonial-2.jpg',
            stars: 4
        },
        {
            name: 'Sophie Laurent',
            position: 'Photographer',
            content: 'As a photographer, I found countless inspiring shots in Capachica. The light over the lake at sunset, the colorful traditional clothing, and the rugged landscapes are truly unique.',
            image: 'assets/images/testimonial-3.jpg',
            stars: 5
        }
    ];

    // Sample data for blog posts
    blogPosts = [
        {
            id: 1,
            title: 'Traditional Weaving in Capachica',
            image: 'assets/images/blog-1.jpg',
            day: '21',
            month: 'Jan',
            year: '2025'
        },
        {
            id: 2,
            title: 'The Best Hiking Trails Around the Peninsula',
            image: 'assets/images/blog-2.jpg',
            day: '15',
            month: 'Feb',
            year: '2025'
        },
        {
            id: 3,
            title: 'Authentic Cooking Class with Local Families',
            image: 'assets/images/blog-3.jpg',
            day: '03',
            month: 'Mar',
            year: '2025'
        }
    ];

    constructor() {}

    ngOnInit(): void {
        // Initialization code if needed
    }
}
