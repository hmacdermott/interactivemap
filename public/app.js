// Load all pins from server
async function loadPins() {
  try {
    showLoading();
    const response = await fetch('/api/pins');

    if (!response.ok) {
      throw new Error('Failed to load pins');
    }

    const data = await response.json();

    // Clear existing markers
    clearMarkers();

    // Add markers for each pin
    data.pins.forEach(pin => {
      addMarker(pin);
    });
  } catch (error) {
    console.error('Load pins error:', error);
    alert('Failed to load pins. Please refresh the page.');
  } finally {
    hideLoading();
  }
}

// Handle image file selection
document.getElementById('pinImageInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('imagePreview').innerHTML = `
        <img src="${e.target.result}" alt="Preview" style="max-width: 200px; margin-top: 10px;">
      `;
    };
    reader.readAsDataURL(file);
  }
});

// Handle pin form submission (create or update)
document.getElementById('pinForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('pinTitleInput').value;
  const description = document.getElementById('pinDescriptionInput').value;
  const latitude = document.getElementById('pinLatitude').value;
  const longitude = document.getElementById('pinLongitude').value;
  const pinId = document.getElementById('pinId').value;
  const currentImageUrl = document.getElementById('currentImageUrl').value;
  const imageFile = document.getElementById('pinImageInput').files[0];

  const errorEl = document.getElementById('pinFormError');
  errorEl.textContent = '';

  try {
    showLoading();

    let imageUrl = currentImageUrl;

    // Upload new image if selected
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      const uploadResponse = await fetch('/api/pins/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Image upload failed');
      }

      const uploadData = await uploadResponse.json();
      imageUrl = uploadData.imageUrl;
    }

    // Check if we have an image URL
    if (!imageUrl) {
      throw new Error('Please select an image');
    }

    // Create or update pin
    const pinData = {
      title,
      description,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      imageUrl
    };

    let response;
    if (pinId) {
      // Update existing pin
      response = await fetch(`/api/pins/${pinId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(pinData)
      });
    } else {
      // Create new pin
      response = await fetch('/api/pins', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(pinData)
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save pin');
    }

    const data = await response.json();

    // Update map
    if (pinId) {
      // Update existing marker
      updateMarker(pinId, data.pin);
      // Reload all pins to refresh
      await loadPins();
    } else {
      // Add new marker
      addMarker(data.pin);
    }

    // Remove temp marker
    if (tempMarker) {
      tempMarker.setMap(null);
      tempMarker = null;
    }

    // Close modal
    document.getElementById('pinFormModal').classList.remove('show');
    document.getElementById('pinForm').reset();
    document.getElementById('imagePreview').innerHTML = '';

    alert(pinId ? 'Pin updated successfully!' : 'Pin created successfully!');
  } catch (error) {
    console.error('Pin save error:', error);
    errorEl.textContent = error.message;
  } finally {
    hideLoading();
  }
});

// Delete pin
async function deletePin(pinId) {
  try {
    showLoading();

    const response = await fetch(`/api/pins/${pinId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete pin');
    }

    // Remove marker from map
    removeMarker(pinId);

    // Close modal
    document.getElementById('pinModal').classList.remove('show');

    alert('Pin deleted successfully!');
  } catch (error) {
    console.error('Delete pin error:', error);
    alert(error.message);
  } finally {
    hideLoading();
  }
}

// Load pins when authenticated
if (authToken) {
  loadPins();
}
