// Three.js Initialization
let scene, camera, renderer, geometry, material, cube;

function initThreeJS() {
    if (!THREE.WEBGL.isWebGLAvailable()) {
        console.error("WebGL not supported");
        return;
    }

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('threejs-container').appendChild(renderer.domElement);

    // Create icosahedron
    geometry = new THREE.IcosahedronGeometry(2, 2);
    material = new THREE.MeshPhongMaterial({
        color: 0x3498db,
        transparent: true,
        opacity: 0.1
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    camera.position.z = 5;

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    renderer.render(scene, camera);
}

// Scroll effects
let scrollTimeout;
window.addEventListener('scroll', () => {
    cube.position.y = window.scrollY * 0.05;
    clearTimeout(scrollTimeout);
    cube.rotation.z = window.scrollY * 0.0005;
    scrollTimeout = setTimeout(() => {
        cube.rotation.z = 0;
    }, 100);
});

// Initialize on load
window.addEventListener('load', () => {
    initThreeJS();
    initDashboardTimer();
    displayFortuneWord();

    // Category button hover effects
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left) / btn.offsetWidth - 0.5;
            const y = (e.clientY - rect.top) / btn.offsetHeight - 0.5;
            btn.style.transform = `perspective(1000px) rotateX(${y * 10}deg) rotateY(${x * 10}deg) translateY(-5px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// Dashboard Timer
function initDashboardTimer() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        document.getElementById('current-time').textContent = timeString;
    }
    setInterval(updateTime, 1000);
    updateTime();
}

// Fortune Word of the Day
const fortuneWords = [
    "Today is the perfect day to refresh your wardrobe!",
    "Style is a way to say who you are without having to speak. - Rachel Zoe",
    "Fashion is the armor to survive the reality of everyday life. - Bill Cunningham",
    "Don't be into trends. Don't make fashion own you, but you decide what you are.",
    "Great style is about being comfortable in what you're wearing.",
    "Fashion is what you buy. Style is what you do with it.",
    "Your confidence is the best outfit you can wear today!",
    "Dress how you want to be addressed. Your style speaks before you do.",
    "The joy of dressing is an art. - John Galliano",
    "Fashion is instant language. - Miuccia Prada"
];

function displayFortuneWord() {
    const randomIndex = Math.floor(Math.random() * fortuneWords.length);
    const fortuneText = document.getElementById('fortune-text');
    if (fortuneText) {
        fortuneText.textContent = fortuneWords[randomIndex];
    }
}

// Navigation System
const pages = {
    'home-toggle': 'home-page',
    'category-toggle': 'category-page',
    'active-offers-toggle': 'active-offers-page',
    'virtual-try-on-toggle': 'virtual-try-on-page',
    'location-toggle': 'location-page',
    'about-toggle': 'about-page'
};

document.querySelectorAll('.nav-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.page').forEach(page => 
            page.classList.remove('active'));
        document.getElementById(pages[btn.id]).classList.add('active');
        
        if (btn.id === 'active-offers-toggle') {
            initializeActiveOffersPage();
        }
    });
});

// Login System
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const loginList = document.getElementById('login-list');

if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value
        };
        
        const listItem = document.createElement('li');
        listItem.textContent = `${user.firstName} ${user.lastName} (${user.email})`;
        loginList.appendChild(listItem);
        loginForm.reset();
        
        // Show new fortune word on login
        displayFortuneWord();
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        loginList.innerHTML = '';
    });
}

// Contact Form Submission
const messageForm = document.getElementById('message-form');
if (messageForm) {
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = messageForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Using Formspree.io for form submission
        fetch(messageForm.action, {
            method: 'POST',
            body: new FormData(messageForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Message sent successfully! We will get back to you soon.');
                messageForm.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            alert('There was a problem sending your message. Please try again later.');
            console.error('Error:', error);
        })
        .finally(() => {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        });
    });
}

// Active Offers Page Functionality
function initializeActiveOffersPage() {
    // Set initial state
    const maleBrands = document.querySelector('#active-offers-page .male-brands');
    const femaleBrands = document.querySelector('#active-offers-page .female-brands');
    const maleBtn = document.querySelector('#active-offers-page .male-btn');
    const femaleBtn = document.querySelector('#active-offers-page .female-btn');
    
    maleBrands.style.display = 'block';
    femaleBrands.style.display = 'none';
    maleBtn.classList.add('active');
    femaleBtn.classList.remove('active');
    
    // Render initial offers
    renderActiveOffers('male');
    
    // Set up toggle buttons
    maleBtn.addEventListener('click', () => {
        maleBtn.classList.add('active');
        femaleBtn.classList.remove('active');
        maleBrands.style.display = 'block';
        femaleBrands.style.display = 'none';
        renderActiveOffers('male');
    });
    
    femaleBtn.addEventListener('click', () => {
        femaleBtn.classList.add('active');
        maleBtn.classList.remove('active');
        maleBrands.style.display = 'none';
        femaleBrands.style.display = 'block';
        renderActiveOffers('female');
    });
}

// Brand data for active offers
const brandData = {
    male: [
        { name: 'Zara Men', url: 'https://www.zara.com/us/en/man.html' },
        { name: 'H&M Men', url: 'https://www2.hm.com/en_us/men.html' },
        { name: 'CK Men', url: 'https://www.calvinklein.us/en/men' }
    ],
    female: [
        { name: 'Zara Women', url: 'https://www.zara.com/us/en/woman.html' },
        { name: 'H&M Women', url: 'https://www2.hm.com/en_us/women.html' },
        { name: 'CK Women', url: 'https://www.calvinklein.us/en/women' }
    ]
};

// Generate active offers
function generateActiveOffers(gender) {
    return Array.from({ length: 6 }, (_, i) => {
        const brandIndex = i % 3;
        const brand = brandData[gender][brandIndex];
        
        return {
            title: `${brand.name} Special Offer ${i + 1}`,
            description: `Exclusive ${gender === 'male' ? "men's" : "women's"} collection deal`,
            discount: `${Math.floor(Math.random() * 20 + 30)}% OFF`,
            code: `ACTIVE${gender.slice(0, 1).toUpperCase()}${i + 100}`,
            expiry: `Expires in ${Math.floor(Math.random() * 10 + 3)} days`,
            brand: brand.name,
            brandUrl: brand.url
        };
    });
}

const activeOffers = {
    male: generateActiveOffers('male'),
    female: generateActiveOffers('female')
};

// Render active offers
function renderActiveOffers(gender) {
    const container = document.getElementById('active-offers-container');
    if (!container) return;
    
    container.innerHTML = '';

    activeOffers[gender].forEach(offer => {
        const card = document.createElement('div');
        card.className = 'active-offer-card';
        card.innerHTML = `
            <h4>${offer.title}</h4>
            <p>${offer.description}</p>
            <div class="discount-badge">${offer.discount}</div>
            <div class="offer-code">Code: ${offer.code}</div>
            <p class="expiry">${offer.expiry}</p>
            <a href="${offer.brandUrl}" target="_blank" class="brand-link">Shop at ${offer.brand}</a>
        `;
        container.appendChild(card);
    });
}

// Category Page Functionality
function generateOffers(gender) {
    return Array.from({ length: 4 }, (_, i) => ({
        title: `${gender === 'male' ? "Men's" : "Women's"} Deal ${i + 1}`,
        discount: `${Math.floor(Math.random() * 30 + 20)}% OFF`,
        code: `FASHION${gender.slice(0, 1).toUpperCase()}${i + 1}`,
        url: `/${gender}-offer-${i + 1}`
    }));
}

const offers = {
    male: generateOffers('male'),
    female: generateOffers('female')
};

function renderOffers(gender) {
    const container = document.getElementById('offers-container');
    if (!container) return;
    container.innerHTML = '';
    offers[gender].forEach(offer => {
        const card = document.createElement('div');
        card.className = 'offer-card';
        card.innerHTML = `
            <h4>${offer.title}</h4>
            <div class="offer-details">
                <span class="discount">${offer.discount}</span><br>
                <span class="code">Code: ${offer.code}</span>
            </div>
        `;
        card.addEventListener('click', () => {
            window.location.href = offer.url;
        });
        container.appendChild(card);
    });
}

// Category toggle
const maleBtn = document.querySelector('.male-btn');
const femaleBtn = document.querySelector('.female-btn');

if (maleBtn && femaleBtn) {
    maleBtn.addEventListener('click', () => {
        document.querySelector('.male-brands').style.display = 'block';
        document.querySelector('.female-brands').style.display = 'none';
        renderOffers('male');
    });

    femaleBtn.addEventListener('click', () => {
        document.querySelector('.male-brands').style.display = 'none';
        document.querySelector('.female-brands').style.display = 'block';
        renderOffers('female');
    });
}

// Virtual Try-On Functionality
const tryOnElements = {
    fileInput: document.getElementById('file-input'),
    uploadBtn: document.getElementById('upload-btn'),
    cameraBtn: document.getElementById('camera-btn'),
    captureBtn: document.getElementById('capture-btn'),
    cameraView: document.getElementById('camera-view'),
    userImage: document.getElementById('user-image'),
    aiOutput: document.getElementById('ai-output'),
    generateBtn: document.getElementById('generate-btn'),
    loadingSpinner: document.getElementById('loading-spinner'),
    canvas: document.createElement('canvas')
};

if (tryOnElements.cameraBtn && tryOnElements.cameraView && tryOnElements.captureBtn) {
    tryOnElements.cameraBtn.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: "user" } 
            });
            tryOnElements.cameraView.srcObject = stream;
            tryOnElements.cameraView.style.display = 'block';
            tryOnElements.cameraView.play();
            tryOnElements.captureBtn.hidden = false;
        } catch (error) {
            alert('Camera access failed: ' + error.message);
        }
    });

    tryOnElements.captureBtn.addEventListener('click', () => {
        const video = tryOnElements.cameraView;
        tryOnElements.canvas.width = video.videoWidth;
        tryOnElements.canvas.height = video.videoHeight;
        const ctx = tryOnElements.canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);

        tryOnElements.userImage.src = tryOnElements.canvas.toDataURL('image/png');
        tryOnElements.userImage.style.display = 'block';
        video.srcObject.getTracks().forEach(track => track.stop());
        video.style.display = 'none';
        tryOnElements.captureBtn.hidden = true;
        
        tryOnElements.canvas.toBlob((blob) => {
            const file = new File([blob], 'capture.png', { type: 'image/png' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            tryOnElements.fileInput.files = dataTransfer.files;
        }, 'image/png');
    });
}

if (tryOnElements.uploadBtn && tryOnElements.fileInput) {
    tryOnElements.uploadBtn.addEventListener('click', () => tryOnElements.fileInput.click());
    tryOnElements.fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                tryOnElements.userImage.src = reader.result;
                tryOnElements.userImage.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

if (tryOnElements.generateBtn) {
    tryOnElements.generateBtn.addEventListener('click', async () => {
        try {
            if (!tryOnElements.fileInput || !tryOnElements.fileInput.files[0]) {
                alert('Please upload an image or take a photo first!');
                return;
            }

            tryOnElements.loadingSpinner.style.display = 'grid';
            tryOnElements.aiOutput.style.display = 'none';

            // Simulate AI processing (replace with actual API call)
            setTimeout(() => {
                tryOnElements.loadingSpinner.style.display = 'none';
                tryOnElements.aiOutput.src = tryOnElements.userImage.src;
                tryOnElements.aiOutput.style.display = 'block';
            }, 2000);
        } catch (error) {
            console.error('AI error:', error);
            alert('Outfit generation failed. Please try again.');
            tryOnElements.loadingSpinner.style.display = 'none';
        }
    });
}

// Google Maps Functionality
let map;
let markers = [];
const locationStatus = document.getElementById('location-status');
const latitudeDisplay = document.getElementById('latitude');
const longitudeDisplay = document.getElementById('longitude');

function initMap(latitude = 51.5074, longitude = -0.1278) {
    const location = { lat: latitude, lng: longitude };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: location,
        mapTypeId: 'roadmap',
        streetViewControl: false
    });

    markers.forEach(marker => marker.setMap(null));
    markers = [];

    markers.push(new google.maps.Marker({
        position: location,
        map,
        title: "Your Location",
        icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        }
    }));

    const service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
        location: location,
        radius: 5000,
        type: ['clothing_store']
    }, (results, status) => {
        if (status === 'OK') {
            results.forEach(place => {
                markers.push(new google.maps.Marker({
                    position: place.geometry.location,
                    map,
                    title: place.name,
                    icon: {
                        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                    }
                }));
            });
        }
    });
}

if (document.getElementById('locate-btn')) {
    document.getElementById('locate-btn').addEventListener('click', () => {
        if (!navigator.geolocation) {
            locationStatus.textContent = "Geolocation not supported.";
            return;
        }

        locationStatus.textContent = "Locating...";
        navigator.geolocation.getCurrentPosition(
            position => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                locationStatus.textContent = "Location found!";
                if (latitudeDisplay) latitudeDisplay.textContent = `Latitude: ${pos.lat.toFixed(4)}`;
                if (longitudeDisplay) longitudeDisplay.textContent = `Longitude: ${pos.lng.toFixed(4)}`;

                initMap(pos.lat, pos.lng);
            },
            error => {
                locationStatus.textContent = "Location error: " + error.message;
                initMap();
            }
        );
    });
}

if (document.getElementById('location-toggle')) {
    document.getElementById('location-toggle').addEventListener('click', () => {
        if (!map && typeof google !== 'undefined') initMap();
    });
}

// Initialize active offers if on that page when loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('active-offers-page')?.classList.contains('active')) {
        initializeActiveOffersPage();
    }
    
    // Initialize maps if on location page
    if (document.getElementById('location-page')?.classList.contains('active') && typeof google !== 'undefined') {
        initMap();
    }
});