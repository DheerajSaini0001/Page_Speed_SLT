import React, { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import { Check, TriangleAlert, X } from "lucide-react";
import CircularProgress from "../Component/CircularProgress";
import { AlertTriangle } from "lucide-react";
export default function On_Page_SEO({ data }) {
  
  const { darkMode } = useContext(ThemeContext);

  if (!data) return <div />;

  
  const ScoreBadge = ({score,out,des}) => {
    const cssscore=score?"bg-green-300":"bg-red-300"
    const hasValue = score ? <Check size={18}/> : <X size={18}/>;
    const badgeBg = darkMode
      ? "bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-black"
      : "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white";

    return (
      <span className={`${
        darkMode
          ? "px-2.5 flex py-1 rounded-full text-white font-semibold text-sm shadow-md transform transition-transform "
          : "px-2.5 flex py-1 rounded-full text-black  font-semibold text-sm shadow-md transform transition-transform "
      } ${cssscore}`}>
        {hasValue} {out} {des}
      </span>
    );
  };

  const containerBg = darkMode
    ? "bg-zinc-900 border-gray-700 text-white"
    : "bg-gray-100 border-gray-300 text-black";

  const cardBg = darkMode
    ? "bg-gradient-to-br from-blue-900 via-gray-900 to-black"
    : "bg-gradient-to-br from-blue-200 via-gray-200 to-white";

  return (
    <div
      id="OnPageSEO"
      className={`min-h-fit pt-20 pb-16 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 m-4 flex flex-col items-center justify-start p-6 space-y-6 ${containerBg}`}
    >
      <h1 className="flex items-center justify-center sm:gap-10 text-3xl font-extrabold mb-6">
        On-Page SEO{" "} 
         <CircularProgress value={data.On_Page_SEO.On_Page_SEO_Score_Total} size={70} stroke={10} />
        
      </h1>

      {/* Essentials */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className="text-xl font-bold mb-4">
          Essentials{" "}
      
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span>Title Score</span>
            <ScoreBadge score={data.On_Page_SEO.Essentials.Unique_Title.Score} 
            out={data.On_Page_SEO.Essentials.Unique_Title.Title_Length}
             des={"characters"}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Meta Description Score</span>
            <ScoreBadge score={data.On_Page_SEO.Essentials.Meta_Description.Score} 
            out={data.On_Page_SEO.Essentials.Meta_Description.MetaDescription_Length} 
            des={"characters"} />
          </div>
          <div className="flex justify-between items-center">
            <span>Canonical Score</span>
            <ScoreBadge score={data.On_Page_SEO.Essentials.Canonical.Score} 
            des={data.On_Page_SEO.Essentials.Canonical.Score ? "Self-refercing":
              "No Self-refercing"
            } 
            />
          </div>
          <div className="flex justify-between items-center">
            <span>H1 Score</span>
            <ScoreBadge score={data.On_Page_SEO.Essentials.H1.Score} out={data.On_Page_SEO.Essentials.H1.Score?"Exectly One":"More than One"} />
          </div>
        </div>
        {(data.On_Page_SEO.Essentials.Unique_Title.Score==0 || data.On_Page_SEO.Essentials.Meta_Description.Score==0 || data.On_Page_SEO.Essentials.Canonical.Score==0 || data.On_Page_SEO.Essentials.H1.Score==0) &&( <hr className="text-black mt-3" />)}
       
        <div className="p-1 mt-2">
        {data.On_Page_SEO.Essentials.Unique_Title.Score==0&&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {data.On_Page_SEO.Essentials.Unique_Title.Parameter}</h1>)}
          {data.On_Page_SEO.Essentials.Meta_Description.Score==0&&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {data.On_Page_SEO.Essentials.Meta_Description.Parameter}</h1>)}
          {data.On_Page_SEO.Essentials.Canonical.Score==0&&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {data.On_Page_SEO.Essentials.Canonical.Parameter}</h1>)}
          {data.On_Page_SEO.Essentials.H1.Score==0&&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {data.On_Page_SEO.Essentials.H1.Parameter}</h1>)}
          
          
        </div>
      </div>

      {/* Media & Semantics */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-purple-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className="text-xl font-bold mb-4">
          Media & Semantics{" "}
         
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4  text-sm">
          <div className="flex justify-between items-center">
            <span>Image ALT Score</span>
            <ScoreBadge score={data.On_Page_SEO.Media_and_Semantics.Image_ALT.Score} out={data.On_Page_SEO.Media_and_Semantics.Image_ALT.Score?"Meaningfull Alt":"Miningless Alt"}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Heading Hierarchy Score</span>
            <ScoreBadge score={data.On_Page_SEO.Media_and_Semantics.Heading_Hierarchy.Score } out={data.On_Page_SEO.Media_and_Semantics.Heading_Hierarchy.Score?"h1->h2..":"h1->h2.."}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Descriptive Links Score</span>
            <ScoreBadge score={data.On_Page_SEO.Media_and_Semantics.Descriptive_Links.Score} out={data.On_Page_SEO.Media_and_Semantics.Descriptive_Links.Score?"Button Text MeaningFull":"Button Text Meaningless"} />
          </div>
        </div>
        {(data.On_Page_SEO.Media_and_Semantics.Image_ALT.Score==0 || data.On_Page_SEO.Media_and_Semantics.Heading_Hierarchy.Score==0 || data.On_Page_SEO.Media_and_Semantics.Descriptive_Links.Score==0) &&(  <hr className="text-black mt-3" /> )}
       
        <div className="p-1 mt-2">
        {data.On_Page_SEO.Media_and_Semantics.Image_ALT.Score==0&&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {data.On_Page_SEO.Media_and_Semantics.Image_ALT.Parameter}</h1>)}
          {data.On_Page_SEO.Media_and_Semantics.Heading_Hierarchy.Score==0&&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {data.On_Page_SEO.Media_and_Semantics.Heading_Hierarchy.Parameter}</h1>)}
          {data.On_Page_SEO.Media_and_Semantics.Descriptive_Links.Score==0&&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {data.On_Page_SEO.Media_and_Semantics.Descriptive_Links.Parameter}</h1>)}
          
          
          
        </div>
      </div>

      {/* Structure & Uniqueness */}
      <div className={`w-full max-w-4xl p-6 rounded-2xl shadow-lg border-l-4 border-pink-500 hover:scale-105 transition-transform duration-300 ${cardBg}`}>
        <h2 className="text-xl font-bold mb-4">
          Structure & Uniqueness{" "}
         
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center">
            <span>URL Slugs Score</span>
            <ScoreBadge score={data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score==1?0:data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score==2?1:0 } out={data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score==2?data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.URL_Slugs_Length:""} des={data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score ==1?"No Slug":data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score ==2?"Slug is meaningfull & length < 75":"Slug is meaningless & length > 75"}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Duplicate Content Score</span>
            <ScoreBadge score={!data.On_Page_SEO.Structure_and_Uniqueness.Duplicate_Content.Score} out={!data.On_Page_SEO.Structure_and_Uniqueness.Duplicate_Content.Score ?"No Duplicate Content":"Duplicate Content"}/>
          </div>
          <div className="flex justify-between items-center">
            <span>Pagination Tags Score</span>
            <ScoreBadge score={data.On_Page_SEO.Structure_and_Uniqueness.Pagination_Tags.Score } out={data.On_Page_SEO.Structure_and_Uniqueness.Pagination_Tags.Score?"Pagination Not found":"Pagination found"}/>
          </div>
        </div>
        {(data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score==1 || data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score==3 || !data.On_Page_SEO.Structure_and_Uniqueness.Duplicate_Content.Score==0 || data.On_Page_SEO.Structure_and_Uniqueness.Pagination_Tags.Score==0) &&( <hr className="text-black mt-3" /> )}
        
        <div className="p-1 mt-2">
        {(data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score==1 || data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score==3) &&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Score==1?"No Slug Found you are at home page":data.On_Page_SEO.Structure_and_Uniqueness.URL_Slugs.Parameter}</h1>)}
          {!data.On_Page_SEO.Structure_and_Uniqueness.Duplicate_Content.Score==0&&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {!data.On_Page_SEO.Structure_and_Uniqueness.Duplicate_Content.Parameter}</h1>)}
          {data.On_Page_SEO.Structure_and_Uniqueness.Pagination_Tags.Score==0&&(<h1 className="flex gap-2"><AlertTriangle size={20} className="text-red-700"/> {data.On_Page_SEO.Structure_and_Uniqueness.Pagination_Tags.Parameter}</h1>)}
          
          
          
        </div>
      </div>
    </div>
  );
}
