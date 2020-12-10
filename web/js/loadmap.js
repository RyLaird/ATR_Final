var map;
var markerPosition;
var autoComplete;
var infowindow = new google.maps.InfoWindow();

function initialization() {
    showAllReports();
    //initAutocomplete();
}





function showAllReports() {
    $.ajax({
        url: 'RunQuery.jsp',
        type: 'POST',
        data: { "tab_id": "1"},
        success: function(reports) {
            mapInitialization(reports);
        },
        error: function(xhr, status, error) {
            alert("An AJAX error occured: " + status + "\nError: " + error);
        }
    });
}

function mapInitialization(reports) {

    const styledMapType = new google.maps.StyledMapType(
        [
            //{ elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
            { elementType: "geometry", stylers: [{ color: "#e6e6e6" }] },
            //{ elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#525151" }] },
            //{ elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#f2f2f2" }] },
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                //stylers: [{ color: "#c9b2a6" }],
                stylers: [{ color: "#b5b3b1"}],
            },
            {
                featureType: "poi.business",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "transit",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "administrative.land_parcel",
                elementType: "geometry.stroke",
                //stylers: [{ color: "#dcd2be" }],
                stylers: [{ color: "#d9d9d9"}],
            },

            {
                featureType: "administrative.land_parcel",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#ae9e90" }],
                stylers: [{ color: "#b0b0b0" }],
            },
            {
                featureType: "landscape.natural",
                elementType: "geometry",
                //stylers: [{ color: "#dfd2ae" }],
                stylers: [{color: "#c9c9c9" }],
            },
            {
                featureType: "poi",
                elementType: "geometry",
                //stylers: [{ color: "#dfd2ae" }],
                stylers: [{color: "#c9c9c9" }],
            },
            {
                featureType: "poi",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#93817c" }],
                stylers: [{ color: "#8f8f8f" }],
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                //stylers: [{ color: "#a5b076" }],
                stylers: [{ color: "#b0b0b0" }],

            },
            {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#447530" }],
                stylers: [{ color: "#6b6b6b" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                //stylers: [{ color: "#f5f1e6" }],
                stylers: [{ color: "#f5f5f5" }],
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                //stylers: [{ color: "#fdfcf8" }],
                stylers: [{ color: "#ffffff" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry",
                //stylers: [{ color: "#f8c967" }],
                stylers: [{ color: "#c7c7c7" }],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                //stylers: [{ color: "#e9bc62" }],
                stylers: [{ color: "#9e9d9b" }],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry",
                //stylers: [{ color: "#e98d58" }],
                stylers: [{ color: "#adabaa"}],
            },
            {
                featureType: "road.highway.controlled_access",
                elementType: "geometry.stroke",
                //stylers: [{ color: "#db8555" }],
                stylers: [{ color: "#cfcdcc" }],
            },
            {
                featureType: "road.local",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#806b63" }],
                stylers: [{ color: "#858585" }],
            },
            {
                featureType: "transit.line",
                elementType: "geometry",
                //stylers: [{ color: "#dfd2ae" }],
                stylers: [{ color: "#cfcfcf" }],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#8f7d77" }],
                stylers: [{ color: "#8c8c8c" }],
            },
            {
                featureType: "transit.line",
                elementType: "labels.text.stroke",
                //stylers: [{ color: "#ebe3cd" }],
                stylers: [{ color: "#d4d4d4" }],
            },
            {
                featureType: "transit.station",
                elementType: "geometry",
                //stylers: [{ color: "#dfd2ae" }],
                stylers: [{ color: "#d1d1d1" }],
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                //stylers: [{ color: "#b9d3c2" }],
                stylers: [{ color: "#becee4" }],
            },
            {
                featureType: "water",
                elementType: "labels.text.fill",
                //stylers: [{ color: "#92998d" }],
                stylers: [{ color: "#878787" }],
            },
        ],
        { name: "Styled Map" }
    );

    // Render the map within the empty div
    map = new google.maps.Map(document.getElementById('map-canvas'), {
        mapTypeControlOptions: {
            mapTypeIds: ["roadmap", "satellite", "hybrid", "terrain", "styled_map"]
        }
    });

    map.mapTypes.set("styled_map", styledMapType);
    map.setMapTypeId("styled_map");

    const map2 = map.data.loadGeoJson(
        "https://aaronj1.github.io/js/GBP_Existing.geojson"
    );
    const map3 = map.data.loadGeoJson(
        "https://aaronj1.github.io/js/Trails_Existing.geojson"
    );

    // Set the stroke width, and fill color for each polygon
    map.data.setStyle({
        strokeColor: 'green',
        strokeWeight: 2,
        strokeOpacity: .5
    });


    var bounds = new google.maps.LatLngBounds();

    myListener = google.maps.event.addListener(map, 'click', function(event) {
        placeMarker(event.latLng); google.maps.event.removeListener(myListener);

    });

    const centerControlDiv = document.createElement("div");
    CenterControl(centerControlDiv, map);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    $.each(reports, function (i, e) {
        var long = Number(e['longitude']);
        var lat = Number(e['latitude']);
        var latlng = new google.maps.LatLng(lat, long);

        bounds.extend(latlng);

        // Create the infoWindow content
        var contentStr = '<h4>Report Details</h4><hr>';
        contentStr += '<p><b>' + 'Report Type' + ':</b>&nbsp' + e['report_type'] +
            '</p>';
        if (e['report_type'] == 'bike' || e['report_type'] == 'pedestrian') {
            contentStr += '<p><b>' + 'Obstruction Type' + ':</b>&nbsp' +
                e['obstruction_type'] + '</p>';
        }
    else
        if (e['report_type'] == 'ADA') {
            contentStr += '<p><b>' + 'Restriction Type' + ':</b>&nbsp' + e['ada_restriction']
                + '</p>';
        }
        // insert reporter first name, last name into popup window
        contentStr += '<p><b>' + 'Reporter' + ':</b> ' + e['first_name'] + ' ' + e['last_name'] + '</p>';

        contentStr += '<p><b>' + 'Timestamp' + ':</b>&nbsp' +
            e['time_stamp'].substring(0, 19) + '</p>';
        if ('message' in e) {
            contentStr += '<p><b>' + 'Message' + ':</b>&nbsp' + e['message'] + '</p>';
        }



        // Create the icons
        const BikeIcon = {
            url: "images/bike_icon.png",
            scaledSize: new google.maps.Size(25, 25)
        };
        const PedIcon = {
            url: "images/ped_icon.png",
            scaledSize: new google.maps.Size(25, 25)
        };
        const ADAIcon = {
            url: "images/ada_icon.png",
            scaledSize: new google.maps.Size(25, 25)
        };


        //if else to assign icon by report type
        if (e['report_type'] == 'bike') {
            marker(BikeIcon)
        } else if (e['report_type'] == 'pedestrian') {
            marker(PedIcon)
        } else marker(ADAIcon);

        //function for marker by reportType
        function marker(reportType) {
            var marker = new google.maps.Marker({ // Set the marker
                position: latlng, // Position marker to coordinates
                map: map, // assign the market to our map variable
                icon: reportType,
                customInfo: contentStr
            });
            marker.addListener('click', function () {
                // use 'customInfo' to customize infoWindow
                infowindow.setContent(marker['customInfo']);
                map.setZoom(16);
                map.setCenter(marker.getPosition());
                infowindow.open(map, marker); // Open InfoWindow
            });
        }

    });

        map.fitBounds (bounds);

};

/*function initAutocomplete() {
    // Create the autocomplete object
    autocomplete = new google.maps.places.Autocomplete(document
        .getElementById('autocomplete'));

    // When the user selects an address from the dropdown, show the place selected
    autocomplete.addListener('place_changed', onPlaceChanged);
}*/

//*****************************  QUESTION 3) Center the place selected from autocomplete address search  *******************************
/*function onPlaceChanged() {
    place = autocomplete.getPlace();
    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }
}*/

function placeMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable: true
    });
    map.setCenter(location);

    var markerPosition = marker.getPosition();
    populateInputs(markerPosition);
    google.maps.event.addListener(marker, "drag", function (mEvent) {
        populateInputs(mEvent.latLng);
    });
}
function populateInputs(pos) {
    document.getElementById("latitude").value=pos.lat()
    document.getElementById("longitude").value=pos.lng()
}


const stlouis = { lat:38.626, lng: -90.233 };

// CenterControl to recenter the map on St. Louis
function CenterControl(controlDiv, map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("div");
    controlUI.style.backgroundColor = "#fff";
    controlUI.style.border = "2px solid #fff";
    controlUI.style.borderRadius = "3px";
    controlUI.style.boxShadow = "0 2px 6px rgba(0,0,0,.3)";
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "22px";
    controlUI.style.textAlign = "center";
    controlUI.title = "Click to recenter the map";
    controlDiv.appendChild(controlUI);
    // Set CSS for the control interior.
    const controlText = document.createElement("div");
    controlText.style.color = "rgb(25,25,25)";
    controlText.style.fontFamily = "Roboto,Arial,sans-serif";
    controlText.style.fontSize = "16px";
    controlText.style.lineHeight = "38px";
    controlText.style.paddingLeft = "5px";
    controlText.style.paddingRight = "5px";
    controlText.innerHTML = "Center Map";
    controlUI.appendChild(controlText);
    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
        map.setCenter(stlouis);
    });
}

//Execute our 'initialization' function once the page has loaded.
google.maps.event.addDomListener(window, 'load', initialization);