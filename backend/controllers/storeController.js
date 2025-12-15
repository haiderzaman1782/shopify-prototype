import supabase from '../config/database.js';

// Get store with all data
export const getStore = async (req, res) => {
  try {
    const { data: store, error } = await supabase
      .from('stores')
      .select('store_id, store_data')
      .eq('u_id', req.user.u_id)
      .single();
    
    if (error || !store) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    const storeData = store.store_data;
    // Ensure store_id and u_id are included
    storeData.store_id = store.store_id;
    storeData.u_id = req.user.u_id;
    
    res.json(storeData);
  } catch (error) {
    console.error('Get store error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update entire store or specific fields
export const updateStore = async (req, res) => {
  try {
    const updateData = req.body.store_data || req.body;
    
    // Get current store
    const { data: currentStore, error: fetchError } = await supabase
      .from('stores')
      .select('store_data')
      .eq('u_id', req.user.u_id)
      .single();
    
    if (fetchError || !currentStore) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    // Merge with existing data (deep merge for nested objects)
    const currentData = currentStore.store_data;
    const updatedData = deepMerge(currentData, updateData);
    
    // Ensure store_id and u_id are preserved
    updatedData.store_id = currentData.store_id || `store_${req.user.u_id}`;
    updatedData.u_id = req.user.u_id;
    
    // Update in database
    const { data: updatedStore, error: updateError } = await supabase
      .from('stores')
      .update({
        store_data: updatedData,
        updated_at: new Date().toISOString()
      })
      .eq('u_id', req.user.u_id)
      .select('store_id, store_data')
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    const storeData = updatedStore.store_data;
    storeData.store_id = updatedStore.store_id;
    storeData.u_id = req.user.u_id;
    
    res.json(storeData);
  } catch (error) {
    console.error('Update store error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update specific field in store_data (e.g., just products, just settings)
export const updateStoreField = async (req, res) => {
  try {
    const { field, value } = req.body; // e.g., field: "products", value: [...]
    
    // Get current store
    const { data: currentStore, error: fetchError } = await supabase
      .from('stores')
      .select('store_data')
      .eq('u_id', req.user.u_id)
      .single();
    
    if (fetchError || !currentStore) {
      return res.status(404).json({ error: 'Store not found' });
    }
    
    // Update specific field
    const updatedData = {
      ...currentStore.store_data,
      [field]: value
    };
    
    // Ensure store_id and u_id are preserved
    updatedData.store_id = currentStore.store_data.store_id || `store_${req.user.u_id}`;
    updatedData.u_id = req.user.u_id;
    
    const { data: updatedStore, error: updateError } = await supabase
      .from('stores')
      .update({
        store_data: updatedData,
        updated_at: new Date().toISOString()
      })
      .eq('u_id', req.user.u_id)
      .select('store_id, store_data')
      .single();
    
    if (updateError) {
      throw updateError;
    }
    
    const storeData = updatedStore.store_data;
    storeData.store_id = updatedStore.store_id;
    storeData.u_id = req.user.u_id;
    
    res.json(storeData);
  } catch (error) {
    console.error('Update store field error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Helper function for deep merge
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}
