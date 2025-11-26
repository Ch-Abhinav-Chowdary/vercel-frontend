import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'worker',
    status: 'active',
    department: '',
    phone: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would be an API call
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'worker', status: 'active', lastLogin: '2023-10-15', department: 'Mining', phone: '555-1234', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'supervisor', status: 'active', lastLogin: '2023-10-14', department: 'Safety', phone: '555-2345', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'admin', status: 'active', lastLogin: '2023-10-13', department: 'IT', phone: '555-3456', avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
      { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'worker', status: 'inactive', lastLogin: '2023-09-20', department: 'Mining', phone: '555-4567', avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
      { id: 5, name: 'Robert Brown', email: 'robert@example.com', role: 'dgms_officer', status: 'active', lastLogin: '2023-10-12', department: 'Regulatory', phone: '555-5678', avatar: 'https://randomuser.me/api/portraits/men/5.jpg' },
      { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'worker', status: 'active', lastLogin: '2023-10-11', department: 'Mining', phone: '555-6789', avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
      { id: 7, name: 'David Wilson', email: 'david@example.com', role: 'supervisor', status: 'active', lastLogin: '2023-10-10', department: 'Maintenance', phone: '555-7890', avatar: 'https://randomuser.me/api/portraits/men/7.jpg' },
      { id: 8, name: 'Lisa Taylor', email: 'lisa@example.com', role: 'worker', status: 'inactive', lastLogin: '2023-09-15', department: 'Safety', phone: '555-8901', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
      { id: 9, name: 'James Anderson', email: 'james@example.com', role: 'admin', status: 'active', lastLogin: '2023-10-09', department: 'IT', phone: '555-9012', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
      { id: 10, name: 'Patricia Martin', email: 'patricia@example.com', role: 'dgms_officer', status: 'active', lastLogin: '2023-10-08', department: 'Regulatory', phone: '555-0123', avatar: 'https://randomuser.me/api/portraits/women/10.jpg' },
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 800);
  }, []);
  
  // Filtered and paginated users
  const filteredUsers = useMemo(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply role filter
    if (activeFilter !== 'all') {
      result = result.filter(user => user.role === activeFilter);
    }
    
    return result;
  }, [users, searchTerm, activeFilter]);
  
  // Pagination
  const usersPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, currentPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'worker',
      status: 'active',
      department: '',
      phone: ''
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      department: user.department || '',
      phone: user.phone || ''
    });
    setIsModalOpen(true);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };
  
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    if (selectedUser) {
      // Update existing user
      const updatedUsers = users.map(user => 
        user.id === selectedUser.id ? { ...user, ...formData } : user
      );
      setUsers(updatedUsers);
      toast.success('User updated successfully');
    } else {
      // Add new user
      const newUser = {
        id: users.length + 1,
        ...formData,
        lastLogin: 'Never'
      };
      setUsers([...users, newUser]);
      toast.success('User added successfully');
    }
    
    setIsModalOpen(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // In a real app, this would be an API call
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      toast.success('User deleted successfully');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'dgms_officer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg mt-10"
    >
      {/* Header with gradient background */}
      <motion.div 
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-6 shadow-md"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-blue-100">Manage your organization's users, roles and permissions</p>
          </div>
          <motion.button
            onClick={handleAddUser}
            className="px-5 py-3 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-300 font-medium flex items-center shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New User
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div 
        className="mb-6 bg-white p-4 rounded-xl shadow-md"
        variants={itemVariants}
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <motion.button 
              onClick={() => handleFilterChange('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              All Users
            </motion.button>
            <motion.button 
              onClick={() => handleFilterChange('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeFilter === 'admin' 
                  ? 'bg-red-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Admins
            </motion.button>
            <motion.button 
              onClick={() => handleFilterChange('supervisor')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeFilter === 'supervisor' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Supervisors
            </motion.button>
            <motion.button 
              onClick={() => handleFilterChange('worker')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeFilter === 'worker' 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Workers
            </motion.button>
            <motion.button 
              onClick={() => handleFilterChange('dgms_officer')}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeFilter === 'dgms_officer' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              DGMS Officers
            </motion.button>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <motion.div 
          className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md"
          variants={itemVariants}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading users...</p>
        </motion.div>
      ) : filteredUsers.length === 0 ? (
        <motion.div 
          className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-md"
          variants={itemVariants}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-600 font-medium">No users found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
        </motion.div>
      ) : (
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden"
          variants={itemVariants}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedUsers.map((user) => (
                    <motion.tr 
                      key={user.id} 
                      className="hover:bg-gray-50 transition-colors"
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -10 }}
                      layout
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt={user.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">{user.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{user.department}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                          {user.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="py-4 px-6 text-right text-sm font-medium space-x-2">
                        <motion.button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition-colors inline-flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors inline-flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * usersPerPage, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> users
              </div>
              <div className="flex space-x-2">
                <motion.button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'
                  }`}
                  whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                >
                  Previous
                </motion.button>
                <motion.button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-blue-600 hover:bg-blue-50 border border-gray-300'
                  }`}
                  whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
                  whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                >
                  Next
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Add/Edit User Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </h2>
                <motion.button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="department">
                      Department
                    </label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g. Mining, Safety"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g. 555-1234"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="role">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                    >
                      <option value="worker">Worker</option>
                      <option value="supervisor">Supervisor</option>
                      <option value="admin">Admin</option>
                      <option value="dgms_officer">DGMS Officer</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="status">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200 mt-6">
                  <div className="flex justify-end space-x-3">
                    <motion.button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={selectedUser ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                      </svg>
                      {selectedUser ? 'Update User' : 'Add User'}
                    </motion.button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserManagement;