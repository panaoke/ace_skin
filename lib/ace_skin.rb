require "ace_skin/engine"
require 'carrierwave'
require 'carrierwave-aliyun'
module AceSkin
  autoload :AceForm,                'ace_skin/ace_form'
  autoload :AceFormHelper,          'ace_skin/ace_form_helper'
  autoload :AppFrame,               'ace_skin/app_frame'
  autoload :Uploader,               'ace_skin/uploader'

  def self.root
	  File.expand_path('../..', __FILE__)
  end

end
CarrierWave::Uploader::Base.send(:add_config, :fast_upload_path)
