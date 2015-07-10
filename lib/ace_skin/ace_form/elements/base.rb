module AceSkin
  module AceForm
    module Elements
      class Base < ActionView::Base
        attr_accessor :options

        def initialize(options)
          @options = options
        end

        [:prefix, :code, :label, :name, :type, :template, :desc, :validation, :value, :required,
         :placeholder].each do |name|
          define_method name do
            options[name]
          end
        end

        def disabled
          options[:disabled] || false
        end

        def html
          (options[:html] || {}).update(common_html).update(ext_html)
        end

        def common_html
          {'data-validation' => validation, id: dom_id, name: dom_name, value: value,
           disabled: (disabled ? :disabled : nil)}
        end

        def get_name
          name || code
        end

        def dom_name
          prefix.blank? ? get_name : "#{prefix}[#{get_name}]"
        end

        def real_id
          prefix.blank? ? code : "#{prefix.to_s.gsub('[','_').gsub(']', '')}_#{code}"
        end

        def dom_id
          options[:html].blank? ? real_id : (options[:html][:id] || code)
        end

        def dom_class
          options[:html].try{|h| h[:class]}.blank? ? 'ace-input' : (options[:html][:class] << ' ace-input')
        end

        def ext_html
          {'data-toggle' => :string, class: dom_class}
        end

        def template
          options[:template] || :default
        end

        def output
          content_tag(:input, html) do

          end
        end

        def view_action(id, index = nil)
          I18n.t("actions.#{id}", :raise => true) rescue id.to_s.humanize
        end

      end
    end
  end

end
