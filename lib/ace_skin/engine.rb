require 'ace_skin/ace_form_helper'
module AceSkin
  class Engine < ::Rails::Engine
    isolate_namespace AceSkin


    initializer 'RailsAdmin precompile hook', group: :all do |app|
	    app.config.assets.precompile += %w(
        ace_skin/application.js
        ace_skin/application.css
        ace_skin/jquery-2.0.3.js
        ace_skin/i18n.js
      )

      app.config.i18n.load_path += Dir[File.join(AceSkin.root, 'config', 'locales',"**", '*.{rb,yml}')]
	  end

    ActionView::Base.send :include, ::AceSkin::AceFormHelper
  end
end
