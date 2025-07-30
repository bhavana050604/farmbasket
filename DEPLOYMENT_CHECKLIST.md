# 🚀 EFarming Deployment Checklist

## ✅ **Pre-Deployment Checklist**

### **1. Database Setup (Railway)**
- [ ] Railway MySQL service is active
- [ ] Database connection details are obtained
- [ ] Database is accessible from Render

### **2. Backend Environment Variables (Render)**
- [ ] `DB_HOST=yamanote.proxy.rlwy.net`
- [ ] `DB_USER=root`
- [ ] `DB_PASSWORD=QGHprRvhXdDaVdCNSpOaasXpajnCNbFq`
- [ ] `DB_NAME=railway`
- [ ] `DB_PORT=12569`
- [ ] `JWT_SECRET=efarming-jwt-secret-2024`
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL=https://efarming-1.onrender.com`

### **3. Frontend Environment Variables (Render)**
- [ ] `REACT_APP_API_URL=https://efarming.onrender.com`

### **4. Database Schema**
- [ ] Tables created: `farmers`, `buyers`, `products`, `orders`
- [ ] Sample data inserted (optional)

## 🔧 **Deployment Steps**

### **Step 1: Deploy Backend**
1. Go to Render dashboard → EFarming backend
2. Add all environment variables
3. Click "Save, rebuild, and deploy"
4. Wait for deployment to complete

### **Step 2: Test Database Connection**
1. Visit: `https://efarming.onrender.com/api/test-db`
2. Should return: `{"status":"success","message":"Database connected successfully ✅"}`

### **Step 3: Deploy Frontend**
1. Go to Render dashboard → EFarming-1 frontend
2. Add environment variable: `REACT_APP_API_URL=https://efarming.onrender.com`
3. Redeploy if needed

### **Step 4: Test Application**
1. Visit: `https://efarming-1.onrender.com`
2. Test admin login: username=`admin`, password=`admin`
3. Test farmer/buyer registration and login
4. Test product upload and purchase flow

## 🐛 **Troubleshooting**

### **Database Connection Issues**
- Check environment variables in Render
- Verify Railway MySQL service is active
- Check Render logs for connection errors

### **CORS Issues**
- Verify `FRONTEND_URL` is set correctly
- Check browser console for CORS errors

### **Admin Login Issues**
- Admin credentials: username=`admin`, password=`admin`
- Check JWT_SECRET is set in environment variables

## 📝 **Important Notes**

- **Admin password remains**: `admin`
- **Database**: Railway MySQL (free tier)
- **Backend**: Render Web Service
- **Frontend**: Render Static Site
- **SSL**: Enabled for production database connections

## 🔐 **Security Notes**

- JWT_SECRET should be a strong, unique string
- Database password is stored securely in environment variables
- CORS is configured for production frontend URL only
- Admin credentials are hardcoded (consider changing for production)

## 🎯 **Success Criteria**

- [ ] Backend deploys successfully
- [ ] Database connection test passes
- [ ] Frontend loads without errors
- [ ] Admin can login successfully
- [ ] Farmers can register and login
- [ ] Buyers can register and login
- [ ] Products can be uploaded and viewed
- [ ] Orders can be placed and managed 