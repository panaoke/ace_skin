module AceSkin
  module AceForm
    module Elements
      class Integer < Base

        def ext_html
          {'data-toggle' => 'integer', 'type' => 'text', 'class' => real_class,
           'data-min' => options[:min].try(:to_i), 'data-max' => options[:max].try(:to_i)}
        end

        def real_class
          options[:html].try{|h| h[:class]}.blank? ? ' ace-input spinner-input ' :
              (options[:html][:class] << ' ace-input spinner-input ')
        end

        def value
          super || (options[:min].blank? ? 0 : options[:min].to_i)
        end

        def validation
          val = super
          (val || '').split(';').push('integer').join(';')
        end

        def output
          content_tag :div do
            super << content_tag(:div, {class: 'space-6'}) do
            end
          end
        end

      end
    end
  end
end
