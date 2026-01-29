// Google Maps instance and markers
let map;
let markers = [];
let tempMarker = null;

// Initialize Google Map
function initMap() {
  // Center on China
  const chinaCenter = { lat: 35.8617, lng: 104.1954 };

  map = new google.maps.Map(document.getElementById('map'), {
    center: chinaCenter,
    zoom: 5,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  });

  // Add click listener to map for creating pins
  map.addListener('click', (event) => {
    if (authToken) {
      showPinFormForNewPin(event.latLng);
    } else {
      alert('Please login to create pins');
    }
  });
}

// Show pin form for new pin
function showPinFormForNewPin(latLng) {
  // Clear form
  document.getElementById('pinForm').reset();
  document.getElementById('pinFormTitle').textContent = 'Create Pin';
  document.getElementById('pinFormSubmitBtn').textContent = 'Create Pin';
  document.getElementById('pinId').value = '';
  document.getElementById('currentImageUrl').value = '';
  document.getElementById('imagePreview').innerHTML = '';
  document.getElementById('pinFormError').textContent = '';

  // Set coordinates
  document.getElementById('pinLatitude').value = latLng.lat();
  document.getElementById('pinLongitude').value = latLng.lng();

  // Show temporary marker
  if (tempMarker) {
    tempMarker.setMap(null);
  }

  tempMarker = new google.maps.Marker({
    position: latLng,
    map: map,
    animation: google.maps.Animation.DROP,
    icon: {
      url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    }
  });

  // Show modal
  document.getElementById('pinFormModal').classList.add('show');
}

// Clear all markers
function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  if (tempMarker) {
    tempMarker.setMap(null);
    tempMarker = null;
  }
}

// Add marker to map
function addMarker(pin) {
  const marker = new google.maps.Marker({
    position: { lat: pin.latitude, lng: pin.longitude },
    map: map,
    title: pin.title,
    animation: google.maps.Animation.DROP,
    icon: {
      url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    }
  });

  // Store pin data with marker
  marker.pinData = pin;

  // Add click listener to show pin details
  marker.addListener('click', () => {
    showPinDetails(pin);
  });

  markers.push(marker);
  return marker;
}

// Update marker position (if needed)
function updateMarker(pinId, newData) {
  const marker = markers.find(m => m.pinData._id === pinId);
  if (marker) {
    marker.pinData = { ...marker.pinData, ...newData };
  }
}

// Remove marker from map
function removeMarker(pinId) {
  const index = markers.findIndex(m => m.pinData._id === pinId);
  if (index !== -1) {
    markers[index].setMap(null);
    markers.splice(index, 1);
  }
}

// Show pin details modal
function showPinDetails(pin) {
  document.getElementById('pinImage').src = pin.imageUrl;
  document.getElementById('pinTitle').textContent = pin.title;
  document.getElementById('pinDescription').textContent = pin.description;
  document.getElementById('pinUser').textContent = `By: ${pin.userId.email}`;

  // Format date
  const date = new Date(pin.createdAt);
  document.getElementById('pinDate').textContent = date.toLocaleDateString();

  // Show edit/delete buttons only for own pins
  const pinActions = document.getElementById('pinActions');
  if (currentUser && pin.userId._id === currentUser.id) {
    pinActions.style.display = 'flex';

    // Set up edit button
    document.getElementById('editPinBtn').onclick = () => {
      document.getElementById('pinModal').classList.remove('show');
      showEditPinForm(pin);
    };

    // Set up delete button
    document.getElementById('deletePinBtn').onclick = () => {
      if (confirm('Are you sure you want to delete this pin?')) {
        deletePin(pin._id);
      }
    };
  } else {
    pinActions.style.display = 'none';
  }

  document.getElementById('pinModal').classList.add('show');
}

// Show edit pin form
function showEditPinForm(pin) {
  document.getElementById('pinFormTitle').textContent = 'Edit Pin';
  document.getElementById('pinFormSubmitBtn').textContent = 'Update Pin';

  document.getElementById('pinTitleInput').value = pin.title;
  document.getElementById('pinDescriptionInput').value = pin.description;
  document.getElementById('pinLatitude').value = pin.latitude;
  document.getElementById('pinLongitude').value = pin.longitude;
  document.getElementById('pinId').value = pin._id;
  document.getElementById('currentImageUrl').value = pin.imageUrl;

  // Show current image preview
  const imagePreview = document.getElementById('imagePreview');
  imagePreview.innerHTML = `<img src="${pin.imageUrl}" alt="Current image" style="max-width: 200px; margin-top: 10px;">`;

  document.getElementById('pinFormError').textContent = '';
  document.getElementById('pinFormModal').classList.add('show');
}

// Close modals
document.getElementById('closePinModal').addEventListener('click', () => {
  document.getElementById('pinModal').classList.remove('show');
});

document.getElementById('closePinFormModal').addEventListener('click', () => {
  document.getElementById('pinFormModal').classList.remove('show');
  if (tempMarker) {
    tempMarker.setMap(null);
    tempMarker = null;
  }
});

// Close modals on outside click
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('show');
    if (tempMarker) {
      tempMarker.setMap(null);
      tempMarker = null;
    }
  }
});

// Initialize map when page loads
window.addEventListener('load', initMap);
