import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Calendar, Clock, Video, Phone, User, Building2, Mail, Globe, AlertCircle, ArrowLeft } from 'lucide-react';

type ConfirmationStatus = 'loading' | 'success' | 'declined' | 'error' | 'already_processed';

export default function MeetingConfirmPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<ConfirmationStatus>('loading');
  const [action, setAction] = useState<'accept' | 'decline' | null>(null);

  const token = searchParams.get('token');
  const requestedAction = searchParams.get('action') as 'accept' | 'decline' | null;
  const meetingId = searchParams.get('id');

  // Mock meeting data - in production, fetch from backend using token
  const mockMeeting = {
    id: meetingId || 'ABC123',
    companyName: 'OZMO Confectionery',
    clientName: 'Ahmed Al-Hassan',
    clientEmail: 'ahmed@gulftrading.ae',
    clientCompany: 'Gulf Trading Co.',
    clientCountry: 'United Arab Emirates',
    preferredDate: '2024-02-15',
    preferredTime: '14:00',
    timezone: 'Asia/Dubai',
    meetingType: 'video' as const,
    productInterest: 'Chocolate wafer bars, Biscuits',
    message: 'We are interested in becoming your distributor in the UAE market. Looking forward to discussing partnership opportunities.',
    estimatedVolume: '2 containers/month',
    googleMeetLink: 'https://meet.google.com/abc-defg-hij',
  };

  useEffect(() => {
    // Simulate API call to process confirmation
    const processConfirmation = async () => {
      if (!token || !requestedAction) {
        setStatus('error');
        return;
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production:
      // 1. Validate token
      // 2. Check if already processed
      // 3. Update meeting status in database
      // 4. Send confirmation email to client
      // 5. Send notification to admin

      setAction(requestedAction);
      setStatus(requestedAction === 'accept' ? 'success' : 'declined');
    };

    processConfirmation();
  }, [token, requestedAction]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-luxury-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-brand font-medium">Processing your response...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-luxury-ivory flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-brand mb-2">Invalid Request</h1>
          <p className="text-gray-600 mb-6">
            This confirmation link is invalid or has expired. Please contact support if you need assistance.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 btn-gold px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'already_processed') {
    return (
      <div className="min-h-screen bg-luxury-ivory flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-brand mb-2">Already Processed</h1>
          <p className="text-gray-600 mb-6">
            This meeting request has already been processed. No further action is required.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 btn-gold px-6 py-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-ivory py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-display font-bold text-brand">
              Brands<span className="text-luxury-gold">Bridge</span>
            </span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Status Header */}
          <div className={`p-8 text-center ${status === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-red-600'} text-white`}>
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              {status === 'success' ? (
                <CheckCircle className="w-10 h-10" />
              ) : (
                <XCircle className="w-10 h-10" />
              )}
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {status === 'success' ? 'Meeting Confirmed!' : 'Meeting Declined'}
            </h1>
            <p className="text-white/80">
              {status === 'success'
                ? 'The client has been notified with the meeting details.'
                : 'The client has been notified that the meeting was declined.'}
            </p>
          </div>

          {/* Meeting Details */}
          <div className="p-8">
            <h2 className="text-lg font-semibold text-brand mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-luxury-gold" />
              Meeting Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-luxury-ivory rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-luxury-gold" />
                  <span className="text-gray-500 text-sm">Date</span>
                </div>
                <p className="font-semibold text-brand">{mockMeeting.preferredDate}</p>
              </div>

              <div className="bg-luxury-ivory rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-luxury-gold" />
                  <span className="text-gray-500 text-sm">Time</span>
                </div>
                <p className="font-semibold text-brand">{mockMeeting.preferredTime} ({mockMeeting.timezone})</p>
              </div>

              <div className="bg-luxury-ivory rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  {mockMeeting.meetingType === 'video' ? (
                    <Video className="w-5 h-5 text-luxury-gold" />
                  ) : (
                    <Phone className="w-5 h-5 text-luxury-gold" />
                  )}
                  <span className="text-gray-500 text-sm">Type</span>
                </div>
                <p className="font-semibold text-brand capitalize">{mockMeeting.meetingType} Call</p>
              </div>

              <div className="bg-luxury-ivory rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="w-5 h-5 text-luxury-gold" />
                  <span className="text-gray-500 text-sm">Product Interest</span>
                </div>
                <p className="font-semibold text-brand">{mockMeeting.productInterest}</p>
              </div>
            </div>

            {/* Client Information */}
            <h2 className="text-lg font-semibold text-brand mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-luxury-gold" />
              Client Information
            </h2>

            <div className="bg-luxury-ivory rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-brand">{mockMeeting.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-brand">{mockMeeting.clientCompany}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-brand">{mockMeeting.clientEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium text-brand">{mockMeeting.clientCountry}</p>
                  </div>
                </div>
              </div>

              {mockMeeting.message && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <p className="text-brand">{mockMeeting.message}</p>
                </div>
              )}
            </div>

            {/* Google Meet Link (only show if accepted) */}
            {status === 'success' && mockMeeting.googleMeetLink && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  Google Meet Link
                </h3>
                <a
                  href={mockMeeting.googleMeetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-medium break-all"
                >
                  {mockMeeting.googleMeetLink}
                </a>
                <p className="text-sm text-emerald-600 mt-2">
                  This link has been sent to the client in the confirmation email.
                </p>
              </div>
            )}

            {/* What's Next */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <h3 className="font-semibold text-amber-800 mb-2">What happens next?</h3>
              {status === 'success' ? (
                <ul className="text-amber-700 text-sm space-y-2">
                  <li>The client will receive a confirmation email with the meeting details and Google Meet link.</li>
                  <li>Both parties will receive a calendar invite.</li>
                  <li>You can add this meeting to your calendar using the link above.</li>
                </ul>
              ) : (
                <ul className="text-amber-700 text-sm space-y-2">
                  <li>The client has been notified that their meeting request was declined.</li>
                  <li>You can reach out to them directly if you'd like to reschedule.</li>
                </ul>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/"
                className="flex-1 text-center py-3 px-4 border-2 border-brand text-brand rounded-xl font-semibold hover:bg-brand hover:text-white transition-colors"
              >
                Go to Homepage
              </Link>
              <Link
                to="/companies"
                className="flex-1 text-center btn-gold py-3"
              >
                View All Companies
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>This is an automated confirmation from Brands Bridge AI.</p>
          <p>For support, contact us at support@brandsbridge.ai</p>
        </div>
      </div>
    </div>
  );
}
