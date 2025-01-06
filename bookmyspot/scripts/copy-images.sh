#!/bin/bash

# Create the public/images directory if it doesn't exist
mkdir -p public/images

# Copy all carparkpayment images to public/images
for i in {1..22}; do
  cp "src/images/carparkpayment${i}.jpg" "public/images/"
done

# Copy the base carparkpayment images
cp "src/images/carparkpayment.jpg" "public/images/"
cp "src/images/carparkpayment2.jpg" "public/images/"

echo "Images copied successfully!"
