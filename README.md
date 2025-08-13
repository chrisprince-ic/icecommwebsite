# IceComm - E-commerce Website

A fully functional e-commerce website built with Next.js, Firebase, and Tailwind CSS. This project provides a complete online shopping experience similar to Amazon.

## Features

### 🛍️ **E-commerce Functionality**
- **Product Catalog**: Browse products by category with filtering and search
- **Product Details**: Detailed product pages with images, descriptions, and stock information
- **Shopping Cart**: Add/remove items, update quantities, and view cart summary
- **User Authentication**: Secure login/register system with Firebase Auth
- **Checkout Process**: Complete checkout flow with shipping and payment forms
- **Order Confirmation**: Order success page with next steps information

### 🎨 **User Interface**
- **Modern Design**: Clean, responsive design with Tailwind CSS
- **Mobile Responsive**: Optimized for all device sizes
- **Search Functionality**: Search products by name, description, or category
- **Category Navigation**: Browse products by category with statistics
- **Featured Products**: Highlighted products on homepage
- **New Arrivals**: Recently added products section

### 🔧 **Technical Features**
- **Firebase Integration**: Real-time database with Firestore
- **Authentication**: Secure user authentication and session management
- **Local Storage**: Cart persistence across browser sessions
- **Real-time Updates**: Cart updates across all components
- **SEO Optimized**: Meta tags and proper page structure
- **Performance**: Optimized images and fast loading times

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: Tailwind CSS v4
- **Backend**: Firebase (Firestore, Authentication)
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project with Firestore database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd icecommwebsite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Add your Firebase configuration to `app/firebase/config.js`

4. **Set up the database**
   - Create a `products` collection in Firestore
   - Add products with the following structure:
   ```json
   {
     "name": "Product Name",
     "description": "Product description",
     "price": 29.99,
     "category": "books",
     "imageUrl": "https://example.com/image.jpg",
     "stock": 50,
     "featured": false,
     "createdAt": "timestamp",
     "updatedAt": "timestamp"
   }
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
icecommwebsite/
├── app/
│   ├── components/          # Reusable components
│   │   ├── Header.js       # Navigation header
│   │   ├── Footer.js       # Site footer
│   │   └── ProductCard.js  # Product display card
│   ├── firebase/           # Firebase configuration
│   │   └── config.js       # Firebase setup
│   ├── cart/               # Shopping cart page
│   ├── categories/         # Product categories page
│   ├── checkout/           # Checkout process
│   ├── login/              # User login
│   ├── product/            # Product detail pages
│   ├── register/           # User registration
│   ├── search/             # Product search
│   ├── order-success/      # Order confirmation
│   ├── globals.css         # Global styles
│   ├── layout.js           # Root layout
│   └── page.js             # Homepage
├── public/                 # Static assets
├── package.json            # Dependencies
└── README.md              # This file
```

## Firebase Database Schema

### Products Collection
```javascript
{
  id: "auto-generated",
  name: "string",
  description: "string", 
  price: "number",
  category: "string",
  imageUrl: "string",
  stock: "number",
  featured: "boolean",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables for Firebase config
4. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Google Cloud Platform
- DigitalOcean App Platform

## Features in Detail

### Authentication
- User registration and login
- Password validation
- Session management
- Protected routes

### Shopping Cart
- Add/remove products
- Update quantities
- Persistent cart data
- Real-time cart updates

### Product Management
- Product listing with pagination
- Category filtering
- Search functionality
- Featured products
- Stock management

### Checkout Process
- Shipping information form
- Payment form (simulated)
- Order summary
- Order confirmation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@icecomm.com or create an issue in the repository.

---

**Note**: This is a demo e-commerce website. For production use, implement proper payment processing, security measures, and additional features like order management, inventory tracking, and admin panels.
