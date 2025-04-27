import supabase from "../config/SupabaseClient";

const uploadImageToSupabase = async (file) => {
  if (!file) return "";
  const fileName = `${Date.now()}-${file.name}`;

  try {
    // Upload the image to Supabase storage
    const { data, error } = await supabase.storage
      .from('review-images')
      .upload(fileName, file);

    if (error) {
      console.error('Supabase upload error:', error.message);
      throw error;
    }

    console.log("File uploaded successfully:", data);

    // Get the public URL for the uploaded file
    const { data: publicUrlData, error: urlError } = await supabase
      .storage
      .from('review-images')
      .getPublicUrl(fileName);

    if (urlError) {
      console.error('Supabase get public URL error:', urlError.message);
      throw urlError;
    }

    console.log("Public URL generated:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image to Supabase:", error.message);
    throw error;
  }
};

export const saveReview = async (reviewData, imageFile) => {
  try {
    // Upload image to Supabase storage and get the URL
    const imageUrl = await uploadImageToSupabase(imageFile);

    // Save the review data and image URL in Supabase's 'reviews' table
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        {
          title: reviewData.title,
          category: reviewData.category,
          review: reviewData.review,
          timestamp: reviewData.timestamp,
          image_url: imageUrl, // Save the image URL
        }
      ]);

    if (error) {
      console.error('Error inserting review:', error.message);
      throw error;
    }

    console.log('Review saved successfully:', data);
    return data[0].id;  // Return the ID of the newly inserted review
  } catch (error) {
    console.error("Error saving review:", error.message);
    throw error;
  }
};
