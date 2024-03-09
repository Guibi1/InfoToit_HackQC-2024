import numpy as np

def generate_points_on_sphere(radius, separation):
    # Estimate the number of points needed, using the surface area of a sphere and approximating
    # each point to occupy an area equivalent to a circle with radius 0.5km (separation distance).
    area_per_point = np.pi * (separation / 2) ** 2
    sphere_surface_area = 4 * np.pi * radius ** 2
    num_points = int(sphere_surface_area / area_per_point)
    
    # Generate points using the Fibonacci lattice approach for relatively uniform distribution
    points = []
    phi = np.pi * (3. - np.sqrt(5.))  # Golden angle in radians
    
    for i in range(num_points):
        y = 1 - (i / float(num_points - 1)) * 2  # y goes from 1 to -1
        radius_for_point = np.sqrt(1 - y * y)  # radius at y
        
        theta = phi * i  # golden angle increment
        
        x = np.cos(theta) * radius_for_point
        z = np.sin(theta) * radius_for_point
        
        # Convert (x, y, z) coordinates to latitude and longitude
        latitude = np.arcsin(y) * (180. / np.pi)
        longitude = np.arctan2(z, x) * (180. / np.pi)
        
        points.append((latitude, longitude))
    
    return points

# Earth's radius in kilometers
earth_radius = 6371
# Desired separation in kilometers
separation_km = 1

# Generate points
points = generate_points_on_sphere(earth_radius, separation_km)
print(f"Generated {len(points)} points on the sphere")
