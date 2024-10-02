import "./App.css";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Login";
import OpenRoute from "./components/core/auth/OpenRoute";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import VerifyEmail from "./pages/VerifyEmail";
import { PrivateRoute } from "./components/core/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Setting from "./components/core/Dashboard/Setting";
import { useSelector } from "react-redux";
import {ACCOUNT_TYPE} from "./Util/constants"
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import Cart from "./components/core/Dashboard/Cart";
import MyCourse from "./components/core/Dashboard/MyCourse";
import AddCourse from "./components/core/Dashboard/AddCourse";
import EditCourse from "./components/core/Dashboard/EditCourse";
import Catalog from "./pages/Catalog";
import Error from "./pages/Error";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";
import Instructor from "./components/core/Dashboard/Instructor";


function App() {

  const {user} = useSelector((state) => state.profile);

  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex flex-col font-inter">
      <Navbar/>
      <Routes>
        <Route path="/" element = {<Home/>}/>
        <Route path="/about" element = {<About/>}/>
        <Route path="/contact" element = {<Contact/>}/>
        <Route path="/catalog/:catalogName" element = {<Catalog/>}/>
        <Route path="/courses/:courseId" element = {<CourseDetails/>}/>
        <Route path="/login"
               element = {
                          <OpenRoute>
                            <Login/>
                          </OpenRoute>
                        }
        />
        <Route path="/signup"
               element = {
                          <OpenRoute>
                            <Signup/>
                          </OpenRoute>
                        }
        />
        <Route path="/forgot-password"
               element = {
                          <OpenRoute>
                            <ForgotPassword/>
                          </OpenRoute>
                        }
        />
        <Route path="update-password/:id"
               element = {
                          <OpenRoute>
                            <UpdatePassword/>
                          </OpenRoute>
                        }
        />
        <Route path="/verify-email"
               element = {
                          <OpenRoute>
                            <VerifyEmail/>
                          </OpenRoute>
                        }
        />

        <Route element = {<PrivateRoute>
                            <Dashboard/>
                          </PrivateRoute>}
        >
          <Route path="/dashboard/my-profile" element = {<MyProfile/>} />
          <Route path="/dashboard/settings" element = {<Setting/>} />
          {
            user?.userType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="/dashboard/enrolled-courses" element = {<EnrolledCourses/>} />
                <Route path="/dashboard/cart" element = {<Cart/>} />
              </>
            )
          }

          {
            user?.userType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
                <Route path="dashboard/instructor" element={<Instructor />} />
                <Route path="/dashboard/my-courses" element = {<MyCourse/>} />
                <Route path="/dashboard/add-course" element = {<AddCourse/>} />
                <Route path="/dashboard/edit-course/:courseId" element = {<EditCourse />}/>
              </>
            )
          }
        </Route>

        <Route element = {
                        <PrivateRoute>
                          <ViewCourse/>
                        </PrivateRoute>}
        >
          {
            user?.userType === ACCOUNT_TYPE.STUDENT && (
              <>
                <Route path="/view-course/:courseId/section/:sectionId/sub-section/:subSectionId" element = {<VideoDetails/>} />
              </>
            )
          }
        </Route>

        <Route path="*" element = {<Error />} />
      </Routes>
    </div>

    
  );
}

export default App;
