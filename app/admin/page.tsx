'use client';
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Package, 
  MessageSquare, 
  Users, 
  Star, 
  Edit, 
  Trash2, 
  Plus, 
  Save,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  Info,
  Phone,
  Mail,
  MapPin,
  BookOpen
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { TourPackage, Review, TeamMember, WebsiteData } from '@/types';

export default function AdminPage() {
  const { isAuthenticated, sendOTP, verifyOTP, logout, websiteData, updateWebsiteData } = useAdmin();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [openDialogs, setOpenDialogs] = useState<{ [key: string]: boolean }>({});
  const [otpExpiresAt, setOtpExpiresAt] = useState<Date | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch pending reviews
  const fetchPendingReviews = useCallback(async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const reviews = await response.json();
        setPendingReviews(reviews.filter((review: Review) => !review.approved));
      }
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPendingReviews();
    }
  }, [isAuthenticated, fetchPendingReviews]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const closeDialog = (dialogKey: string) => {
    setOpenDialogs(prev => ({ ...prev, [dialogKey]: false }));
  };

  const openDialog = (dialogKey: string) => {
    setOpenDialogs(prev => ({ ...prev, [dialogKey]: true }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    const result = await sendOTP(email);
    if (result.success) {
      setStep('otp');
      setOtpExpiresAt(new Date(Date.now() + 10 * 60 * 1000));
      showNotification('success', 'OTP sent to your email!');
    } else {
      setLoginError(result.error || 'Failed to send OTP');
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    const success = await verifyOTP(email, otp);
    if (success) {
      setOtp('');
      setEmail('');
      showNotification('success', 'Successfully logged in!');
    } else {
      setLoginError('Invalid or expired OTP');
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setLoginError('');
    setOtp('');

    const result = await sendOTP(email);
    if (result.success) {
      setOtpExpiresAt(new Date(Date.now() + 10 * 60 * 1000));
      showNotification('success', 'New OTP sent to your email!');
    } else {
      setLoginError(result.error || 'Failed to resend OTP');
    }
    setIsLoading(false);
  };

  const handleReviewAction = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action }),
      });

      if (response.ok) {
        await fetchPendingReviews();
        showNotification('success', `Review ${action}d successfully!`);
        closeDialog(`review-${reviewId}`);
      } else {
        showNotification('error', `Failed to ${action} review`);
      }
    } catch (error) {
      showNotification('error', `Error ${action}ing review`);
    }
  };

  const handleSaveChanges = async (data: WebsiteData, successMessage: string, dialogKey?: string) => {
    try {
      setIsLoading(true);
      await updateWebsiteData(data);
      showNotification('success', successMessage);
      if (dialogKey) {
        closeDialog(dialogKey);
      }
    } catch (error) {
      showNotification('error', 'Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
            {step === 'otp' && (
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                Enter the OTP sent to {email}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Admin Email</label>
                  <Input
                    type="email"
                    placeholder="Enter admin email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {loginError && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Enter OTP</label>
                  <Input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                    className="text-center text-2xl tracking-widest"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    OTP expires in 10 minutes
                  </p>
                </div>
                {loginError && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{loginError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <div className="flex items-center justify-between text-sm">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStep('email');
                        setOtp('');
                        setLoginError('');
                      }}
                      disabled={isLoading}
                    >
                      Change Email
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                    >
                      Resend OTP
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto z-50">
          <Alert className={`${notification.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'}`}>
            {notification.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
            <AlertDescription className={notification.type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
              {notification.message}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <Button onClick={logout} variant="outline" className="w-full sm:w-auto">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="settings" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 gap-1">
            <TabsTrigger value="settings" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3">
              <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">About</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">Contact</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Package className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">Packages</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3">
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">Reviews {pendingReviews.length > 0 && `(${pendingReviews.length})`}</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">Team</span>
            </TabsTrigger>
          </TabsList>

          {/* Site Settings */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Site Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SiteSettingsForm 
                  websiteData={websiteData} 
                  onSave={(data: WebsiteData) => handleSaveChanges(data, 'Site settings updated successfully!')}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Content */}
          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>About Page Content</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <AboutContentForm 
                  websiteData={websiteData} 
                  onSave={(data: WebsiteData) => handleSaveChanges(data, 'About content updated successfully!')}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Information */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Contact Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ContactInfoForm 
                  websiteData={websiteData} 
                  onSave={(data: WebsiteData) => handleSaveChanges(data, 'Contact information updated successfully!')}
                  isLoading={isLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tour Packages */}
          <TabsContent value="packages">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Tour Packages</span>
                  </div>
                  <Dialog open={openDialogs['add-package']} onOpenChange={(open) => open ? openDialog('add-package') : closeDialog('add-package')}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Package
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Add New Package</DialogTitle>
                      </DialogHeader>
                      <PackageForm 
                        onSave={(packageData: TourPackage) => {
                          const newPackage = {
                            ...packageData,
                            id: Date.now().toString(),
                          };
                          const updatedData = {
                            ...websiteData,
                            tourPackages: [...websiteData.tourPackages, newPackage]
                          };
                          handleSaveChanges(updatedData, 'Package added successfully!', 'add-package');
                        }}
                        isLoading={isLoading}
                      />
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {websiteData.tourPackages.map((pkg) => (
                    <PackageCard 
                      key={pkg.id} 
                      package={pkg} 
                      websiteData={websiteData}
                      onSave={(data: WebsiteData) => handleSaveChanges(data, 'Package updated successfully!')}
                      onDelete={(data: WebsiteData) => handleSaveChanges(data, 'Package deleted successfully!')}
                      isLoading={isLoading}
                      openDialogs={openDialogs}
                      openDialog={openDialog}
                      closeDialog={closeDialog}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Management */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              {/* Pending Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span>Pending Reviews ({pendingReviews.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingReviews.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No pending reviews</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingReviews.map((review) => (
                        <Card key={review.id} className="border-l-4 border-l-yellow-500">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold">{review.name}</h4>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < review.rating 
                                            ? 'fill-yellow-400 text-yellow-400' 
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(review.submittedAt || review.date).toLocaleDateString()}
                                  </Badge>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">{review.comment}</p>
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <Dialog open={openDialogs[`review-${review.id}`]} onOpenChange={(open) => open ? openDialog(`review-${review.id}`) : closeDialog(`review-${review.id}`)}>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4 mr-1" />
                                      Review
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Review Details</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div>
                                        <label className="text-sm font-medium">Name:</label>
                                        <p className="text-gray-600 dark:text-gray-300">{review.name}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Rating:</label>
                                        <div className="flex items-center space-x-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              className={`h-4 w-4 ${
                                                i < review.rating 
                                                  ? 'fill-yellow-400 text-yellow-400' 
                                                  : 'text-gray-300'
                                              }`}
                                            />
                                          ))}
                                          <span className="ml-2">({review.rating}/5)</span>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Comment:</label>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1">{review.comment}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Submitted:</label>
                                        <p className="text-gray-600 dark:text-gray-300">
                                          {new Date(review.submittedAt || review.date).toLocaleString()}
                                        </p>
                                      </div>
                                      <div className="flex space-x-2 pt-4">
                                        <Button 
                                          onClick={() => handleReviewAction(review.id, 'approve')}
                                          className="bg-green-600 hover:bg-green-700"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve
                                        </Button>
                                        <Button 
                                          onClick={() => handleReviewAction(review.id, 'reject')}
                                          variant="destructive"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject
                                        </Button>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Published Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Published Reviews ({websiteData.reviews.filter(r => r.approved !== false).length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PublishedReviewsManager 
                    websiteData={websiteData}
                    onSave={(data: WebsiteData) => handleSaveChanges(data, 'Reviews updated successfully!')}
                    isLoading={isLoading}
                    openDialogs={openDialogs}
                    openDialog={openDialog}
                    closeDialog={closeDialog}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Management */}
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Team Members</span>
                  </div>
                  <Dialog open={openDialogs['add-member']} onOpenChange={(open) => open ? openDialog('add-member') : closeDialog('add-member')}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Team Member</DialogTitle>
                      </DialogHeader>
                      <TeamMemberForm 
                        onSave={(memberData: TeamMember) => {
                          const newMember = {
                            ...memberData,
                            id: Date.now().toString(),
                          };
                          const updatedData = {
                            ...websiteData,
                            aboutContent: {
                              ...websiteData.aboutContent,
                              teamMembers: [...websiteData.aboutContent.teamMembers, newMember]
                            }
                          };
                          handleSaveChanges(updatedData, 'Team member added successfully!', 'add-member');
                        }}
                        isLoading={isLoading}
                      />
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {websiteData.aboutContent.teamMembers.map((member) => (
                    <TeamMemberCard 
                      key={member.id} 
                      member={member} 
                      websiteData={websiteData}
                      onSave={(data: WebsiteData) => handleSaveChanges(data, 'Team member updated successfully!')}
                      onDelete={(data: WebsiteData) => handleSaveChanges(data, 'Team member deleted successfully!')}
                      isLoading={isLoading}
                      openDialogs={openDialogs}
                      openDialog={openDialog}
                      closeDialog={closeDialog}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Site Settings Form Component
interface SiteSettingsFormProps {
  websiteData: WebsiteData;
  onSave: (data: WebsiteData) => void;
  isLoading: boolean;
}

function SiteSettingsForm({ websiteData, onSave, isLoading }: SiteSettingsFormProps) {
  const [formData, setFormData] = useState(websiteData.siteSettings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      ...websiteData,
      siteSettings: formData
    };
    onSave(updatedData);
  };

  const handleDestinationChange = (index: number, value: string) => {
    const newDestinations = [...formData.popularDestinations];
    newDestinations[index] = value;
    setFormData({ ...formData, popularDestinations: newDestinations });
  };

  const addDestination = () => {
    setFormData({
      ...formData,
      popularDestinations: [...formData.popularDestinations, '']
    });
  };

  const removeDestination = (index: number) => {
    const newDestinations = formData.popularDestinations.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, popularDestinations: newDestinations });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <Input
            value={formData.siteName}
            onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Site Title</label>
          <Input
            value={formData.siteTitle}
            onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Hero Background Image URL</label>
        <Input
          value={formData.heroBackgroundImage}
          onChange={(e) => setFormData({ ...formData, heroBackgroundImage: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Popular Destinations</label>
        <div className="space-y-2">
          {formData.popularDestinations.map((destination: string, index: number) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={destination}
                onChange={(e) => handleDestinationChange(index, e.target.value)}
                placeholder="Enter destination"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => removeDestination(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addDestination}>
            <Plus className="h-4 w-4 mr-2" />
            Add Destination
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

// About Content Form Component
interface AboutContentFormProps {
  websiteData: WebsiteData;
  onSave: (data: WebsiteData) => void;
  isLoading: boolean;
}

function AboutContentForm({ websiteData, onSave, isLoading }: AboutContentFormProps) {
  const [formData, setFormData] = useState(websiteData.aboutContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      ...websiteData,
      aboutContent: formData
    };
    onSave(updatedData);
  };

  const handleWhyChooseUsChange = (index: number, value: string) => {
    const newReasons = [...formData.whyChooseUs];
    newReasons[index] = value;
    setFormData({ ...formData, whyChooseUs: newReasons });
  };

  const addWhyChooseUsReason = () => {
    setFormData({
      ...formData,
      whyChooseUs: [...formData.whyChooseUs, '']
    });
  };

  const removeWhyChooseUsReason = (index: number) => {
    const newReasons = formData.whyChooseUs.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, whyChooseUs: newReasons });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">About Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">About Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Mission</label>
          <Textarea
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Vision</label>
          <Textarea
            value={formData.vision}
            onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
            rows={4}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Mission & Vision Image URL</label>
        <Input
          value={formData.missionVisionImage}
          onChange={(e) => setFormData({ ...formData, missionVisionImage: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Why Choose Us Reasons</label>
        <div className="space-y-2">
          {formData.whyChooseUs.map((reason: string, index: number) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={reason}
                onChange={(e) => handleWhyChooseUsChange(index, e.target.value)}
                placeholder="Enter reason"
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => removeWhyChooseUsReason(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addWhyChooseUsReason}>
            <Plus className="h-4 w-4 mr-2" />
            Add Reason
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

// Contact Info Form Component
interface ContactInfoFormProps {
  websiteData: WebsiteData;
  onSave: (data: WebsiteData) => void;
  isLoading: boolean;
}

function ContactInfoForm({ websiteData, onSave, isLoading }: ContactInfoFormProps) {
  const [formData, setFormData] = useState(websiteData.contactInfo);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = {
      ...websiteData,
      contactInfo: formData
    };
    onSave(updatedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Address</label>
        <Textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={2}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Google Maps Embed URL</label>
        <Input
          value={formData.mapEmbedUrl}
          onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Latitude</label>
          <Input
            type="number"
            step="any"
            value={formData.coordinates.lat}
            onChange={(e) => setFormData({ 
              ...formData, 
              coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) || 0 }
            })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Longitude</label>
          <Input
            type="number"
            step="any"
            value={formData.coordinates.lng}
            onChange={(e) => setFormData({ 
              ...formData, 
              coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) || 0 }
            })}
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}

// Published Reviews Manager Component
interface PublishedReviewsManagerProps {
  websiteData: WebsiteData;
  onSave: (data: WebsiteData) => void;
  isLoading: boolean;
  openDialogs: { [key: string]: boolean };
  openDialog: (key: string) => void;
  closeDialog: (key: string) => void;
}

function PublishedReviewsManager({ websiteData, onSave, isLoading, openDialogs, openDialog, closeDialog }: PublishedReviewsManagerProps) {
  const publishedReviews = websiteData.reviews.filter((review: Review) => review.approved !== false);

  const handleDeleteReview = (reviewId: string) => {
    const updatedData = {
      ...websiteData,
      reviews: websiteData.reviews.filter((review: Review) => review.id !== reviewId)
    };
    onSave(updatedData);
  };

  const handleEditReview = (reviewId: string, updatedReview: Review) => {
    const updatedData = {
      ...websiteData,
      reviews: websiteData.reviews.map((review: Review) => 
        review.id === reviewId ? { ...updatedReview, id: reviewId } : review
      )
    };
    onSave(updatedData);
  };

  if (publishedReviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No published reviews yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {publishedReviews.map((review: Review) => (
        <Card key={review.id} className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold">{review.name}</h4>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs bg-green-50 border-green-200">
                    Published
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">{review.comment}</p>
                <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Dialog open={openDialogs[`edit-review-${review.id}`]} onOpenChange={(open) => open ? openDialog(`edit-review-${review.id}`) : closeDialog(`edit-review-${review.id}`)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Review</DialogTitle>
                    </DialogHeader>
                    <ReviewEditForm 
                      review={review}
                      onSave={(updatedReview: Review) => {
                        handleEditReview(review.id, updatedReview);
                        closeDialog(`edit-review-${review.id}`);
                      }}
                      isLoading={isLoading}
                    />
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteReview(review.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Review Edit Form Component
interface ReviewEditFormProps {
  review: Review;
  onSave: (review: Review) => void;
  isLoading: boolean;
}

function ReviewEditForm({ review, onSave, isLoading }: ReviewEditFormProps) {
  const [formData, setFormData] = useState(review);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Rating</label>
        <Input
          type="number"
          min="1"
          max="5"
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 1 })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Comment</label>
        <Textarea
          value={formData.comment}
          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Avatar URL (optional)</label>
        <Input
          value={formData.avatar || ''}
          onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Review'}
      </Button>
    </form>
  );
}

// Package Form Component
interface PackageFormProps {
  package?: TourPackage;
  onSave: (packageData: TourPackage) => void;
  isLoading: boolean;
}

function PackageForm({ package: pkg, onSave, isLoading }: PackageFormProps) {
  const [formData, setFormData] = useState(pkg || {
    id: '',
    name: '',
    description: '',
    image: '',
    price: 0,
    discountedPrice: 0,
    duration: '',
    location: '',
    features: [],
    rating: 5,
    reviews: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: Number(formData.price),
      discountedPrice: formData.discountedPrice ? Number(formData.discountedPrice) : undefined,
      rating: Number(formData.rating),
      reviews: Number(formData.reviews),
      features: formData.features.filter((f: string) => f.trim())
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Package Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Price (₹)</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Discounted Price (₹)</label>
          <Input
            type="number"
            value={formData.discountedPrice || ''}
            onChange={(e) => setFormData({ ...formData, discountedPrice: Number(e.target.value) || undefined })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Duration</label>
          <Input
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <Input
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Features (one per line)</label>
        <Textarea
          value={formData.features.join('\n')}
          onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n') })}
          placeholder="Beach Resort&#10;All Meals Included&#10;Airport Transfers"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Rating</label>
          <Input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) || 5 })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Number of Reviews</label>
          <Input
            type="number"
            value={formData.reviews}
            onChange={(e) => setFormData({ ...formData, reviews: Number(e.target.value) || 0 })}
            required
          />
        </div>
      </div>
      <Button type="submit" disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Package'}
      </Button>
    </form>
  );
}

// Package Card Component
interface PackageCardProps {
  package: TourPackage;
  websiteData: WebsiteData;
  onSave: (data: WebsiteData) => void;
  onDelete: (data: WebsiteData) => void;
  isLoading: boolean;
  openDialogs: { [key: string]: boolean };
  openDialog: (key: string) => void;
  closeDialog: (key: string) => void;
}

function PackageCard({ package: pkg, websiteData, onSave, onDelete, isLoading, openDialogs, openDialog, closeDialog }: PackageCardProps) {
  const handleDelete = () => {
    const updatedData = {
      ...websiteData,
      tourPackages: websiteData.tourPackages.filter((p: TourPackage) => p.id !== pkg.id)
    };
    onDelete(updatedData);
  };

  const handleEdit = (packageData: TourPackage) => {
    const updatedData = {
      ...websiteData,
      tourPackages: websiteData.tourPackages.map((p: TourPackage) => 
        p.id === pkg.id ? { ...packageData, id: pkg.id } : p
      )
    };
    onSave(updatedData);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <img src={pkg.image} alt={pkg.name} className="w-full h-32 object-cover rounded mb-3" />
        <h3 className="font-semibold mb-2">{pkg.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{pkg.location}</p>
        <p className="text-lg font-bold text-green-600">₹{pkg.discountedPrice || pkg.price}</p>
        <div className="flex space-x-2 mt-3">
          <Dialog open={openDialogs[`edit-${pkg.id}`]} onOpenChange={(open) => open ? openDialog(`edit-${pkg.id}`) : closeDialog(`edit-${pkg.id}`)}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Package</DialogTitle>
              </DialogHeader>
              <PackageForm 
                package={pkg} 
                onSave={(data: TourPackage) => {
                  handleEdit(data);
                  closeDialog(`edit-${pkg.id}`);
                }}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Team Member Form Component
interface TeamMemberFormProps {
  member?: TeamMember;
  onSave: (member: TeamMember) => void;
  isLoading: boolean;
}

function TeamMemberForm({ member, onSave, isLoading }: TeamMemberFormProps) {
  const [formData, setFormData] = useState(member || {
    id: '',
    name: '',
    role: '',
    image: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Role</label>
        <Input
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Image URL</label>
        <Input
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        <Save className="h-4 w-4 mr-2" />
        {isLoading ? 'Saving...' : 'Save Member'}
      </Button>
    </form>
  );
}

// Team Member Card Component
interface TeamMemberCardProps {
  member: TeamMember;
  websiteData: WebsiteData;
  onSave: (data: WebsiteData) => void;
  onDelete: (data: WebsiteData) => void;
  isLoading: boolean;
  openDialogs: { [key: string]: boolean };
  openDialog: (key: string) => void;
  closeDialog: (key: string) => void;
}

function TeamMemberCard({ member, websiteData, onSave, onDelete, isLoading, openDialogs, openDialog, closeDialog }: TeamMemberCardProps) {
  const handleDelete = () => {
    const updatedData = {
      ...websiteData,
      aboutContent: {
        ...websiteData.aboutContent,
        teamMembers: websiteData.aboutContent.teamMembers.filter((m: TeamMember) => m.id !== member.id)
      }
    };
    onDelete(updatedData);
  };

  const handleEdit = (memberData: TeamMember) => {
    const updatedData = {
      ...websiteData,
      aboutContent: {
        ...websiteData.aboutContent,
        teamMembers: websiteData.aboutContent.teamMembers.map((m: TeamMember) => 
          m.id === member.id ? { ...memberData, id: member.id } : m
        )
      }
    };
    onSave(updatedData);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <img src={member.image} alt={member.name} className="w-full h-32 object-cover rounded mb-3" />
        <h3 className="font-semibold mb-1">{member.name}</h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{member.role}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{member.description}</p>
        <div className="flex space-x-2">
          <Dialog open={openDialogs[`edit-member-${member.id}`]} onOpenChange={(open) => open ? openDialog(`edit-member-${member.id}`) : closeDialog(`edit-member-${member.id}`)}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Team Member</DialogTitle>
              </DialogHeader>
              <TeamMemberForm 
                member={member} 
                onSave={(data: TeamMember) => {
                  handleEdit(data);
                  closeDialog(`edit-member-${member.id}`);
                }}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
