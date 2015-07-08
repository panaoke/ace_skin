module AceSkin
  module AppFrame
    class LinkConfig
      class_attribute :link_config

      self.link_config = YAML.load_file(File.join(Rails.root, 'config/link_groups.yml'))

    end
  end
end
