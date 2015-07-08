require "ace_skin/engine"

module AceSkin
  autoload :AceForm,                'ace_skin/ace_form'
  autoload :AceFormHelper,          'ace_skin/ace_form_helper'
  autoload :AppFrame,                'ace_skin/app_frame'

  def self.root
	  File.expand_path('../..', __FILE__)
  end

end
