import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import { Check, X, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import CircularProgress from "../Component/CircularProgress"; // Imported CircularProgress
import AuditDropdown from "../Component/AuditDropdown";
export default function Security_Compilance({ data }) {
  const { darkMode } = useContext(ThemeContext);

  if (!data) return <div />;

  // ScoreBadge with descriptive text
  const ScoreBadge = ({ score, textGood, textBad }) => {
    const cssscore = score ? "mobilebutton bg-green-300" : "mobilebutton bg-red-300";
    const hasValue = score ? <Check size={18} /> : <X size={18} />;
    return (
      <span className={`px-2.5 flex items-center gap-1.5 py-1 rounded-full text-black font-semibold text-sm shadow-md transform transition-transform ${cssscore}`}>
        {hasValue} {score ? textGood : textBad}
      </span>
    );
  };

  const containerBg = darkMode ? "bg-zinc-900 border-gray-700 text-white" : "bg-gray-100 border-gray-300 text-black";
  const cardBg = darkMode ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black" : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";
  const textColor = darkMode ? "text-white" : "text-black";


  return (
    <div
      id="SecurityCompliance"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className={`responsive text-heading-25 flex sm:gap-10 justify-center items-center text-3xl font-extrabold mb-6 text-center ${textColor}`}>
        Security/Compliance 
         <CircularProgress
                  value={data.Security_or_Compliance.Percentage}
                  size={70}
                  stroke={5}
                />

        
      </h1>

      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

          <div className=" flex justify-between items-center">
            <span className={textColor}>Hypertext Transfer Protocol Secure (HTTPS)</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.HTTPS.Score} 
              textGood="HTTPS enabled" 
              textBad="HTTPS missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Secure Socket Layer (SSL)</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.SSL.Score} 
              textGood="SSL enabled" 
              textBad="SSL missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>SSL Expiry</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.SSL_Expiry.Score} 
              textGood="Headers present" 
              textBad="Headers missing"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>HSTS</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.HSTS.Score} 
              textGood="Banner found" 
              textBad="Banner missing"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className={textColor}>TLS Version</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.TLS_Version.Score} 
              textGood="TLS 1.2 or higher" 
              textBad="Lower than TLS 1.2"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>X-Frame-Options</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.X_Frame_Options.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>CSP</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.CSP.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>X Content Type Options</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.X_Content_Type_Options.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Cookies Secure</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Cookies_Secure.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Cookies_HttpOnly</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Cookies_HttpOnly.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Google Safe Browsing</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Google_Safe_Browsing.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Blacklist</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Blacklist.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Malware Scan</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Malware_Scan.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>SQLi_Exposure</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.SQLi_Exposure.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>XSS</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.XSS.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Cookie Consent</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Cookie_Consent.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Forms Use HTTPS</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Forms_Use_HTTPS.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>GDPR CCPA</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.GDPR_CCPA.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Data_Collection</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Data_Collection.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Weak Default Credentials</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Weak_Default_Credentials.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Multi-Factor Authentication Enabled</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.MFA_Enabled.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
          <div className="flex justify-between items-center">
            <span className={textColor}>Admin Panel Public</span>
            <ScoreBadge 
              score={data.Security_or_Compliance.Admin_Panel_Public.Score} 
              textGood="Enabled" 
              textBad="Missing"
            />

          </div>
        </div>


      </div>
<AuditDropdown items={data.Security_or_Compliance.Passed} title="Passed Audits" />
<AuditDropdown items={data.Security_or_Compliance.Warning} title="Warning" />
<AuditDropdown items={data.Security_or_Compliance.Improvements} title="Failed Audits" />
    </div>
  );
}
