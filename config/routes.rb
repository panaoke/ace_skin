AceSkin::Engine.routes.draw do

    get 'icons', to: 'application#icons'
    get 'form_test', to: 'application#form_test'
	  post 'files', to: 'files#create'

end
