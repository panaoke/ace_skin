module AceSkin
  module AceForm
    module Elements
      class Boolean < Radio

        def ext_html
          {'data-toggle' => 'boolean', type: :radio, class: 'ace-input'}
        end

        def value
          if options[:value].is_a?(String)
            options[:value]
          else
            val = '0'
            val = '1' if options[:value].is_a?(TrueClass)
            val
          end
        end

        def collection
          {'1' => view_action('yes'), '0' => view_action('no')}
        end

      end
    end
  end
end
