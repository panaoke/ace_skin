module AceSkin
  class ApplicationController < ::ApplicationController

    def icons
      render '/ace/icons', layout: nil
    end

    def form_test
      render '/ace_form/test', layout: 'ace'
    end

  end
end
