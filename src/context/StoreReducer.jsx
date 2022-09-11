const getInitialValue = (key, initialValue) => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      // Get from local storage by key
      const item = JSON.parse(window.localStorage.getItem(key));
      // Parse stored json or if none return initialValue
      
      return item ? item : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      
      return initialValue;
    }
}

const setValue = (key, value) => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log(error);
    }
};

const types ={
    ChangeActualHost:"ChangeActualHost",
    AddCamera: "AddCamera",
    Login: "Login",
    Logout: "Logout",
    UpdateCameras: "UpdateCameras",
    UpdateUsers: "UpdateUsers",
    Register: "Register",
}
const initialStore= {
    user:   getInitialValue("user", ''),
    actualHost: getInitialValue("actualHost", ''),
    cameras: getInitialValue("cameras", []),
    token: getInitialValue("token", ''),
    users: getInitialValue("users", []),
    type: getInitialValue("type", false),
}

const storeReducer = (state,action) =>{
    
    switch(action.type){
        case types.Register:
              setValue("user", action.body.user)
              setValue("actualHost", "")
              setValue("cameras", [])
              setValue("users", [])
              setValue("token", "")
              setValue("type", action.body.type)
              return {
                ...state,
                user: action.body.user,
                type: action.body.type
              }
        case types.Login:
            setValue("user", action.body.user)
            if(action.body.cameras.length > 0)setValue("actualHost", action.body.cameras[0].ip)
            setValue("cameras", action.body.cameras)
            setValue("token", action.body.token)
            setValue("users", action.body.users)
            setValue("type", action.body.type)
            return {
                ...state,
                user: action.body.user,
                cameras: action.body.cameras,
                token: action.body.token,
                users: action.body.users,
                type: action.body.type
            }
        case types.UpdateCameras:
            setValue("cameras", action.body)
            return {
                ...state,
                cameras: action.body
            }
        case types.UpdateUsers:
            setValue("users", action.body)
            return {
                ...state,
                users: action.body
            }

        case types.AddCamera:
            setValue("user", action.body.user)
            setValue("cameras", [...state.cameras, action.body])
            return {
                ...state,
                cameras: [...state.cameras, action.body]
            }
        case types.ChangeActualHost:
            setValue("actualHost", action.body)
            return {
                ...state,
                actualHost: action.body
            }
        case types.Logout:
              setValue("user", "")
              setValue("actualHost", "")
              setValue("cameras", [])
              setValue("users", [])
              setValue("token", "")
              setValue("type", false)
              return {
                  user: "",
                  actualHost: "",
                  cameras: [],
                  token: "",
              }
        default:
            return state;
    }

}

export {initialStore, types }
export default storeReducer;